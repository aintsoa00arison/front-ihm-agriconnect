// services/invitation/types.ts

export interface Invitation {
  id: string;
  sender_id: string;
  sender_object: {
    id: string;
    email: string;
    pseudonyme?: string;
    photo?: string;
  };
  receiver_id: string;
  publication_id?: string;  // ⭐ AJOUTÉ
  status: string;
  token?: string;  // ⭐ AJOUTÉ
  created_at: string;
  updated_at: string;
  accepted_at?: string;
}

export interface InvitationCreateInput {
  sender_id: string;
  receiver_id: string;
  publication_id?: string;  // ⭐ AJOUTÉ
  message?: string;
}

export interface InvitationOutput {
  id: string;
  sender_id: string;
  sender_object: {
    id: string;
    email: string;
    pseudonyme?: string;
    photo?: string;
  };
  receiver_id: string;
  publication_id?: string;  // ⭐ AJOUTÉ
  status: string;
  token?: string;  // ⭐ AJOUTÉ
}