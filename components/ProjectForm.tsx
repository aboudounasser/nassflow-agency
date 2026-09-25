'use client';

import { FormEvent, useState } from 'react';
import { AnimatePresence, m } from 'motion/react';
import { getSupabaseClient } from '@/lib/supabase/client';
import { sendNotification } from '@/lib/notify';
import { transitions } from '@/lib/motion';
import { formStyles, FormStepTitle } from '@/components/forms/form-ui';
import { MotionProvider } from '@/components/motion/MotionProvider';

/** Motion n'est chargé que sur les pages qui portent ce formulaire. */
export function ProjectForm() {
  return (
    <MotionProvider>
      <ProjectFormFields />
    </MotionProvider>
  );
}

function ProjectFormFields() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setSuccess(false);
    setError('');

    const form = event.currentTarget;
    const formData = new FormData(form);

    const value = (key: string) => String(formData.get(key) ?? '').trim();

    let website = value('website');

    if (website && !/^https?:\/\//i.test(website)) {
      website = `https://${website}`;
    }

    const payload = {
      first_name: value('firstName') || null,
      last_name: value('lastName') || null,
      company: value('company') || null,
      professional_email: value('email'),
      phone: value('phone') || null,
      website: website || null,
      solution: value('solution') || null,
      main_need: value('need') || null,
      current_tools: value('tools') || null,
      budget: value('budget') || null,
      timeline: value('timeline') || null,
      project_description: value('message'),
      source: value('source') || null,
    };

    try {
      const { error: insertError } = await getSupabaseClient()
        .from('project_requests')
        .insert(payload);

      if (insertError) throw insertError;
    } catch (insertError) {
      console.error('Supabase insert error:', insertError);

      setError(
        'Une erreur est survenue lors de l\u2019envoi. V\u00e9rifiez votre connexion puis r\u00e9essayez.',
      );

      setIsSubmitting(false);
      return;
    }

    await sendNotification('project', payload);

    form.reset();
    setSuccess(true);
    setIsSubmitting(false);
  }

  return (
      <form
        onSubmit={handleSubmit}
        className="border-t border-rule"
      >
        <div className="border-b border-rule py-7 sm:py-8">
          <FormStepTitle step="01">Votre entreprise</FormStepTitle>

          <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-10">
            <div className={formStyles.fieldWrap}>
              <label
                htmlFor="firstName"
                className={formStyles.label}
              >
                Prénom <span className={formStyles.optional}>(facultatif)</span>
              </label>

              <input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                placeholder="Votre prénom"
                className={formStyles.input}
              />
            </div>

            <div className={formStyles.fieldWrap}>
              <label
                htmlFor="lastName"
                className={formStyles.label}
              >
                Nom <span className={formStyles.optional}>(facultatif)</span>
              </label>

              <input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                placeholder="Votre nom"
                className={formStyles.input}
              />
            </div>

            <div className={formStyles.fieldWrap}>
              <label
                htmlFor="company"
                className={formStyles.label}
              >
                Entreprise <span className={formStyles.optional}>(facultatif)</span>
              </label>

              <input
                id="company"
                name="company"
                type="text"
                autoComplete="organization"
                placeholder="Nom de votre entreprise"
                className={formStyles.input}
              />
            </div>

            <div className={formStyles.fieldWrap}>
              <label
                htmlFor="email"
                className={formStyles.label}
              >
                E-mail professionnel
              </label>

              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                inputMode="email"
                placeholder="vous@entreprise.com"
                className={formStyles.input}
              />
            </div>

            <div className={`${formStyles.fieldWrap} sm:col-span-2`}>
              <label
                htmlFor="phone"
                className={formStyles.label}
              >
                Téléphone <span className={formStyles.optional}>(facultatif)</span>
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                placeholder="Votre numéro de téléphone"
                className={formStyles.input}
              />
            </div>

            <div className={`${formStyles.fieldWrap} sm:col-span-2`}>
              <label
                htmlFor="website"
                className={formStyles.label}
              >
                Site web
                <span className={formStyles.optional}>
                  (facultatif)
                </span>
              </label>

              <input
                id="website"
                name="website"
                type="text"
                inputMode="url"
                autoComplete="url"
                placeholder="https://votre-site.com"
                className={formStyles.input}
              />
            </div>
          </div>
        </div>

        <div className="border-b border-rule py-7 sm:py-8">
          <FormStepTitle step="02">Votre projet</FormStepTitle>

          <div className="space-y-8 sm:space-y-9">
            <div className={formStyles.fieldWrap}>
              <label
                htmlFor="solution"
                className={formStyles.label}
              >
                Que souhaitez-vous mettre en place ? <span className={formStyles.optional}>(facultatif)</span>
              </label>

              <select
                id="solution"
                name="solution"
                defaultValue=""
                className={formStyles.select}
              >
                <option value="" disabled className={formStyles.option}>
                  Sélectionnez une solution
                </option>

                <option value="ai-assistant" className={formStyles.option}>
                  Assistant IA
                </option>

                <option value="whatsapp-ai" className={formStyles.option}>
                  WhatsApp IA
                </option>

                <option value="automation" className={formStyles.option}>
                  Automatisation
                </option>

                <option value="ai-agent" className={formStyles.option}>
                  Agent IA
                </option>

                <option value="integration" className={formStyles.option}>
                  Intégration d&apos;outils
                </option>

                <option value="multiple" className={formStyles.option}>
                  Plusieurs solutions
                </option>

                <option value="unknown" className={formStyles.option}>
                  Je ne sais pas encore
                </option>
              </select>
            </div>

            <div className={formStyles.fieldWrap}>
              <label
                htmlFor="need"
                className={formStyles.label}
              >
                Quel est votre principal besoin ? <span className={formStyles.optional}>(facultatif)</span>
              </label>

              <textarea
                id="need"
                name="need"
                rows={4}
                placeholder="Décrivez le problème que vous souhaitez résoudre..."
                className={formStyles.textarea}
              />
            </div>

            <div className={formStyles.fieldWrap}>
              <label
                htmlFor="tools"
                className={formStyles.label}
              >
                Quels outils utilisez-vous actuellement ?
              </label>

              <input
                id="tools"
                name="tools"
                type="text"
                placeholder="CRM, ERP, WhatsApp, logiciels métier..."
                className={formStyles.input}
              />
            </div>

            <div className={formStyles.fieldWrap}>
              <label
                htmlFor="budget"
                className={formStyles.label}
              >
                Budget envisagé <span className={formStyles.optional}>(facultatif)</span>
              </label>

              <select
                id="budget"
                name="budget"
                defaultValue=""
                className={formStyles.select}
              >
                <option value="" disabled className={formStyles.option}>
                  Sélectionnez une fourchette
                </option>

                <option value="under-1000" className={formStyles.option}>
                  Moins de 1 000 €
                </option>

                <option value="1000-3000" className={formStyles.option}>
                  1 000 € — 3 000 €
                </option>

                <option value="3000-5000" className={formStyles.option}>
                  3 000 € — 5 000 €
                </option>

                <option value="5000-10000" className={formStyles.option}>
                  5 000 € — 10 000 €
                </option>

                <option value="over-10000" className={formStyles.option}>
                  Plus de 10 000 €
                </option>

                <option value="unknown" className={formStyles.option}>
                  Je ne sais pas encore
                </option>
              </select>
            </div>

            <div className={formStyles.fieldWrap}>
              <label
                htmlFor="timeline"
                className={formStyles.label}
              >
                Délai souhaité <span className={formStyles.optional}>(facultatif)</span>
              </label>

              <select
                id="timeline"
                name="timeline"
                defaultValue=""
                className={formStyles.select}
              >
                <option value="" disabled className={formStyles.option}>
                  Sélectionnez un délai
                </option>

                <option value="urgent" className={formStyles.option}>
                  Dès que possible
                </option>

                <option value="1-month" className={formStyles.option}>
                  Dans le mois
                </option>

                <option value="1-3-months" className={formStyles.option}>
                  Dans 1 à 3 mois
                </option>

                <option value="3-6-months" className={formStyles.option}>
                  Dans 3 à 6 mois
                </option>

                <option value="later" className={formStyles.option}>
                  Plus tard
                </option>

                <option value="unknown" className={formStyles.option}>
                  Pas encore défini
                </option>
              </select>
            </div>
          </div>
        </div>

        <div className="py-7 sm:py-8">
          <FormStepTitle step="03">Votre demande</FormStepTitle>

          <div className={formStyles.fieldWrap}>
            <label
              htmlFor="message"
              className={formStyles.label}
            >
              Votre message
            </label>

            <textarea
              id="message"
              name="message"
              required
              rows={7}
              placeholder="Une question rapide ou le détail de votre projet — les deux vont bien."
              className={formStyles.textarea}
            />
          </div>

          <div className={`${formStyles.fieldWrap} mt-8`}>
            <label
              htmlFor="source"
              className={formStyles.label}
            >
              Comment avez-vous connu NASSFLOW ? <span className={formStyles.optional}>(facultatif)</span>
            </label>

            <select
              id="source"
              name="source"
              defaultValue=""
              className={formStyles.select}
            >
              <option value="" className={formStyles.option}>
                Sélectionnez une option
              </option>

              <option value="google" className={formStyles.option}>
                Google
              </option>

              <option value="social" className={formStyles.option}>
                Réseaux sociaux
              </option>

              <option value="recommendation" className={formStyles.option}>
                Recommandation
              </option>

              <option value="other" className={formStyles.option}>
                Autre
              </option>
            </select>
          </div>
        </div>

        <div aria-live="polite" className="empty:hidden">
          <AnimatePresence mode="wait">
            {success && (
              <m.div
                key="success"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8, transition: transitions.exit }}
                transition={transitions.base}
                className={`${formStyles.success} mb-6 text-[1.0625rem] leading-[1.6] text-ink-body`}
              >
                <span className="font-sans font-bold text-ink">
                  Demande envoyée.
                </span>{' '}
                Merci. Nous avons bien reçu votre projet et nous reviendrons
                vers vous prochainement.
              </m.div>
            )}

            {error && (
              <m.div
                key="error"
                role="alert"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8, transition: transitions.exit }}
                transition={transitions.base}
                className={formStyles.error}
              >
                {error}
              </m.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-col gap-5 border-t border-rule pt-7 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:pt-8">
          <p className={formStyles.note}>
            Les informations transmises servent uniquement à comprendre
            votre projet et à vous recontacter au sujet de votre demande.
          </p>

          <button
            type="submit"
            disabled={isSubmitting}
            className={formStyles.submit}
          >
            {isSubmitting ? 'Envoi en cours…' : 'Envoyer ma demande'}
          </button>
        </div>
      </form>
  );
}
