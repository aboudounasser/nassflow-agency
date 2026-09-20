/**
 * Les deux façons de nous joindre sans passer par le formulaire en trois
 * parties : un e-mail et un créneau de trente minutes. Elles vivent ici
 * plutôt qu'en dur dans les composants, parce qu'elles apparaissent dans
 * le pied de page (donc sur toutes les routes) et sur l'accueil, et
 * qu'une adresse qui change ne doit se corriger qu'à un seul endroit.
 */

export const CONTACT_EMAIL = 'contact@nassflow.com';

export const BOOKING_URL = 'https://calendly.com/contact-nassflow/30min';
