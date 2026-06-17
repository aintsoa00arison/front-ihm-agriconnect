// services/evaluation/evaluationService.ts

import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';

export interface Evaluation {
  id: string;
  assessor_id: string;
  assessor_object: {
    id: string;
    email: string;
    pseudonyme?: string;
    photo?: string;
  };
  assessee_id: string;
  rating_value: number;
  review: string;
}

class EvaluationService {
  private baseUrl = '/evaluation';

  /**
   * Récupère toutes les évaluations reçues par un utilisateur
   */
  async getEvaluationsByUserId(userId: string): Promise<Evaluation[]> {
    try {
      const url = API_ENDPOINTS.EVALUATION_ALL.replace('{user_id}', userId);
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des évaluations:', error);
      throw error;
    }
  }

  /**
   * Récupère les 5 meilleures évaluations d'un utilisateur
   */
  async getTop5Evaluations(userId: string): Promise<Evaluation[]> {
    try {
      const url = API_ENDPOINTS.EVALUATION_TOP.replace('{user_id}', userId);
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des top évaluations:', error);
      throw error;
    }
  }

  /**
   * Récupère les 5 moins bonnes évaluations d'un utilisateur
   */
  async getBottom5Evaluations(userId: string): Promise<Evaluation[]> {
    try {
      const url = API_ENDPOINTS.EVALUATION_BOTTOM.replace('{user_id}', userId);
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des bottom évaluations:', error);
      throw error;
    }
  }

  /**
   * Crée une évaluation
   */
  async createEvaluation(data: {
    assessor_id: string;
    assessee_id: string;
    rating_value: number;
    review: string;
  }): Promise<any> {
    try {
      const response = await apiClient.post(API_ENDPOINTS.EVALUATION_CREATE, data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la création de l\'évaluation:', error);
      throw error;
    }
  }

  /**
   * Met à jour une évaluation
   */
  async updateEvaluation(data: {
    evaluation_id: string;
    assessor_id: string;
    rating_value: number;
    review: string;
  }): Promise<any> {
    try {
      const response = await apiClient.post(API_ENDPOINTS.EVALUATION_UPDATE, data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour de l\'évaluation:', error);
      throw error;
    }
  }

  /**
   * Supprime une évaluation
   */
  async deleteEvaluation(evaluationId: string, assessorId: string): Promise<any> {
    try {
      const url = API_ENDPOINTS.EVALUATION_DELETE.replace('{evaluation_id}', evaluationId);
      const response = await apiClient.delete(`${url}?assessor_id=${assessorId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la suppression de l\'évaluation:', error);
      throw error;
    }
  }
}

export const evaluationService = new EvaluationService();