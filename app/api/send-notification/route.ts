import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { type, data } = body;

    if (!data) {
      return Response.json(
        { error: "Données manquantes." },
        { status: 400 },
      );
    }

    const isProject = type === "project";

    const subject = isProject
      ? `🚀 Nouvelle demande de projet — ${data.company || "Entreprise"}`
      : `📩 Nouveau message — ${data.name || "Contact"}`;

    const content = isProject
      ? `
        <h2>Nouvelle demande de projet NASSFLOW</h2>

        <h3>👤 Contact</h3>
        <p><strong>Prénom :</strong> ${data.first_name || "-"}</p>
        <p><strong>Nom :</strong> ${data.last_name || "-"}</p>
        <p><strong>Entreprise :</strong> ${data.company || "-"}</p>
        <p><strong>Email :</strong> ${data.professional_email || "-"}</p>
        <p><strong>Téléphone :</strong> ${data.phone || "-"}</p>
        <p><strong>Site web :</strong> ${data.website || "-"}</p>

        <h3>⚙️ Projet</h3>
        <p><strong>Solution :</strong> ${data.solution || "-"}</p>
        <p><strong>Besoin principal :</strong> ${data.main_need || "-"}</p>
        <p><strong>Outils actuels :</strong> ${data.current_tools || "-"}</p>
        <p><strong>Budget :</strong> ${data.budget || "-"}</p>
        <p><strong>Délai souhaité :</strong> ${data.timeline || "-"}</p>

        <h3>📝 Demande</h3>
        <p><strong>Description :</strong></p>
        <p>${data.project_description || "-"}</p>

        <p><strong>Comment a-t-il connu NASSFLOW :</strong> ${data.source || "-"}</p>
      `
      : `
        <h2>Nouveau message de contact NASSFLOW</h2>

        <p><strong>Nom :</strong> ${data.name || "-"}</p>
        <p><strong>Email :</strong> ${data.email || "-"}</p>
        <p><strong>Sujet :</strong> ${data.subject || "-"}</p>

        <h3>Message</h3>
        <p>${data.message || "-"}</p>
      `;

    const { error } = await resend.emails.send({
      from: "NASSFLOW <onboarding@resend.dev>",
      to: ["contact@nassflow.com"],
      subject,
      html: content,
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