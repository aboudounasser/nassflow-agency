import { Resend } from "resend";

/** Échappe une valeur avant de l'insérer dans le corps HTML de l'e-mail :
 *  sans cela, un visiteur peut placer ses propres balises et liens dans
 *  la notification que nous recevons. */
function esc(value: unknown): string {
  if (value === null || value === undefined || value === "") return "-";

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  try {
    // Instancié ici et non au niveau du module : une clé absente ne doit
    // pas faire échouer la collecte des routes pendant `next build`.
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.error("RESEND_API_KEY absente : notification non envoyée.");

      return Response.json(
        { error: "Service d'envoi indisponible." },
        { status: 503 },
      );
    }

    const resend = new Resend(apiKey);

    const body = await request.json();

    const { type, data } = body;

    if (!data) {
      return Response.json(
        { error: "Données manquantes." },
        { status: 400 },
      );
    }

    const isProject = type === "project";

    const oneLine = (value: unknown, fallback: string) =>
      String(value ?? "").replace(/[\r\n]+/g, " ").trim() || fallback;

    const subject = isProject
      ? `🚀 Nouvelle demande de projet — ${oneLine(data.company, "Entreprise")}`
      : `📩 Nouveau message — ${oneLine(data.name, "Contact")}`;

    const content = isProject
      ? `
        <h2>Nouvelle demande de projet NASSFLOW</h2>

        <h3>👤 Contact</h3>
        <p><strong>Prénom :</strong> ${esc(data.first_name)}</p>
        <p><strong>Nom :</strong> ${esc(data.last_name)}</p>
        <p><strong>Entreprise :</strong> ${esc(data.company)}</p>
        <p><strong>Email :</strong> ${esc(data.professional_email)}</p>
        <p><strong>Téléphone :</strong> ${esc(data.phone)}</p>
        <p><strong>Site web :</strong> ${esc(data.website)}</p>

        <h3>⚙️ Projet</h3>
        <p><strong>Solution :</strong> ${esc(data.solution)}</p>
        <p><strong>Besoin principal :</strong> ${esc(data.main_need)}</p>
        <p><strong>Outils actuels :</strong> ${esc(data.current_tools)}</p>
        <p><strong>Budget :</strong> ${esc(data.budget)}</p>
        <p><strong>Délai souhaité :</strong> ${esc(data.timeline)}</p>

        <h3>📝 Demande</h3>
        <p><strong>Description :</strong></p>
        <p>${esc(data.project_description)}</p>

        <p><strong>Comment a-t-il connu NASSFLOW :</strong> ${esc(data.source)}</p>
      `
      : `
        <h2>Nouveau message de contact NASSFLOW</h2>

        <p><strong>Nom :</strong> ${esc(data.name)}</p>
        <p><strong>Email :</strong> ${esc(data.email)}</p>
        <p><strong>Sujet :</strong> ${esc(data.subject)}</p>

        <h3>Message</h3>
        <p>${esc(data.message)}</p>
      `;

    // `onboarding@resend.dev` est le domaine bac à sable de Resend : il
    // n'a ni SPF ni DKIM au nom de nassflow.com. Une fois le domaine
    // vérifié dans Resend, renseigner RESEND_FROM et les notifications
    // cesseront de partir en spam.
    const from =
      process.env.RESEND_FROM ?? "NASSFLOW <onboarding@resend.dev>";

    const replyTo = isProject ? data.professional_email : data.email;

    const { error } = await resend.emails.send({
      from,
      to: ["contact@nassflow.com"],
      subject,
      html: content,
      ...(typeof replyTo === "string" && replyTo.includes("@")
        ? { replyTo }
        : {}),
    });

    if (error) {
      console.error("Erreur Resend :", error);

      return Response.json(
        { error: "Impossible d'envoyer l'e-mail." },
        { status: 500 },
      );
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Erreur API notification :", error);

    return Response.json(
      { error: "Une erreur est survenue." },
      { status: 500 },
    );
  }
}