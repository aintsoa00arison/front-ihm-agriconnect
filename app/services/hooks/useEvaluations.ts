"use client";

import { useState, useEffect, useCallback } from 'react';
import { evaluationService, Evaluation } from '../evaluation/evaluationService';
import { toast } from 'sonner';

export const useEvaluations = (userId?: string) => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [averageRating, setAverageRating] = useState<number>(0);

  // Charger les évaluations
  const loadEvaluations = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await evaluationService.getEvaluationsByUserId(userId);
      setEvaluations(data);
      
      // Calculer la note moyenne
      if (data.length > 0) {
        const sum = data.reduce((acc, eval_) => acc + eval_.rating_value, 0);
        setAverageRating(sum / data.length);
      } else {
        setAverageRating(0);
      }
    } catch (err: any) {
      const errorMsg = err.message || "Erreur lors du chargement des évaluations";
      setError(errorMsg);
      console.error('❌ Erreur loadEvaluations:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // ⭐ Fonction utilitaire pour extraire l'email
  const extractEmail = (email: any): string => {
    if (!email) return '';
    if (typeof email === 'string') return email;
    if (typeof email === 'object' && email.value) return email.value;
    return '';
  };

  // ⭐ Transformer les évaluations pour le composant ProfileReviews
  const getReviewsForProfile = useCallback(() => {
    return evaluations.map((eval_) => {
      // Extraire le nom de l'évaluateur
      let authorName = 'Utilisateur';
      const assessor = eval_.assessor_object;
      
      if (assessor) {
        // Priorité au pseudonyme
        if (assessor.pseudonyme) {
          authorName = assessor.pseudonyme;
        } else {
          // Sinon extraire de l'email
          const emailStr = extractEmail(assessor.email);
          if (emailStr) {
            authorName = emailStr.split('@')[0];
          }
        }
      }

      // Extraire la photo
      const authorAvatar = eval_.assessor_object?.photo || undefined;

      // Formater la date
      const date = new Date().toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      return {
        id: eval_.id,
        authorName: authorName,
        authorAvatar: authorAvatar,
        rating: eval_.rating_value,
        comment: eval_.review || 'Aucun commentaire',
        date: date
      };
    });
  }, [evaluations]);

  // Créer une évaluation
  const createEvaluation = useCallback(async (data: {
    assessee_id: string;
    rating_value: number;
    review: string;
  }) => {
    if (!userId) {
      toast.error("Vous devez être connecté pour évaluer");
      return null;
    }

    try {
      const response = await evaluationService.createEvaluation({
        assessor_id: userId,
        ...data
      });
      
      toast.success("Évaluation envoyée avec succès !");
      await loadEvaluations();
      return response;
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de l'envoi de l'évaluation");
      return null;
    }
  }, [userId, loadEvaluations]);

  // Chargement initial
  useEffect(() => {
    loadEvaluations();
  }, [loadEvaluations]);

  return {
    evaluations,
    loading,
    error,
    averageRating,
    loadEvaluations,
    createEvaluation,
    getReviewsForProfile,
    totalReviews: evaluations.length,
  };
};