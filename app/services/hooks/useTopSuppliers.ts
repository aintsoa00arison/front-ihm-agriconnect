// services/hooks/useTopSuppliers.ts
"use client";

import { useState, useEffect } from 'react';
import { profileService } from '../profile/profileService';
import type { Supplier } from '../publication/catalogue';

// 🔥 Cache pour éviter les appels multiples
const cache = new Map<string, { data: Supplier[]; timestamp: number }>();
const CACHE_DURATION = 60000; // 1 minute

const transformProfileToSupplier = (profile: any): Supplier => {
  // ⭐ Récupérer l'ID
  const userId = profile.id || '';
  
  // ⭐ Récupérer la photo (priorité à photo puis avatarUrl)
  const photoUrl = profile.photo || profile.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80";
  
  // Récupérer le type de production
  const productionType = profile.product_category && profile.product_category.length > 0
    ? profile.product_category[0]
    : "Non spécifié";
  
  const typeMap: Record<string, string> = {
    'VEGETAL': 'Végétale',
    'ANIMAL': 'Élevage',
    'CEREAL': 'Rente'
  };
  
  return {
    id: userId,  // ⭐ ID de l'utilisateur
    name: profile.name || "Utilisateur",
    location: profile.address || profile.registered_office || "Non spécifié",
    productionType: typeMap[productionType] || productionType,
    rating: profile.rating || 0,
    avatar: photoUrl,  // ⭐ Photo du profil
  };
};

export const useTopSuppliers = (userRole: 'fournisseur' | 'collecteur') => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopSuppliers = async () => {
      const isProvider = userRole === 'fournisseur';
      const cacheKey = isProvider ? 'top_collectors' : 'top_providers';
      
      // 🔥 Vérifier le cache
      const cached = cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        console.log('📦 Utilisation du cache pour', cacheKey);
        setSuppliers(cached.data);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        let data = [];
        
        if (isProvider) {
          console.log('🔍 Récupération du Top 5 des collecteurs');
          data = await profileService.getTopCollectors(5);
        } else {
          console.log('🔍 Récupération du Top 5 des fournisseurs');
          data = await profileService.getTopProviders(5);
        }
        
        console.log('📦 Données brutes du Top 5:', JSON.stringify(data, null, 2));
        
        // ⭐ Vérifier que chaque profil a une photo
        data.forEach((profile, index) => {
          console.log(`📸 Profile ${index + 1} - photo:`, profile.photo, 'avatarUrl:', profile.avatarUrl);
        });
        
        const transformed = data.map(transformProfileToSupplier);
        console.log('🔄 Suppliers transformés:', transformed);
        
        // 🔥 Mettre en cache
        cache.set(cacheKey, {
          data: transformed,
          timestamp: Date.now()
        });
        
        setSuppliers(transformed);
      } catch (error) {
        console.error('❌ Erreur récupération Top 5:', error);
        setError('Erreur lors du chargement');
        setSuppliers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopSuppliers();
  }, [userRole]);

  return { suppliers, isLoading, error };
};