export type Lang = 'en' | 'es' | 'pt' | 'hi';

export interface LangOption {
  code: Lang;
  label: string;
  flag: string;
}

export interface FormStrings {
  namePh: string;
  emailPh: string;
  messagePh: string;
  send: string;
  sending: string;
  success: string;
  error: string;
}

export const LANG_STORAGE_KEY = 'prospects-lang';

export const WHATSAPP_MESSAGES: Record<Lang, string> = {
  en: "Hi Jorge, I saw your page and I'm interested in a website.",
  es: 'Hola Jorge, vi su página y me interesa un sitio web.',
  pt: 'Oi Jorge, vi sua página e tenho interesse em um site.',
  hi: 'नमस्ते Jorge, मैंने आपका पेज देखा और मुझे वेबसाइट बनवानी है।',
};

export const FORM_STRINGS: Record<Lang, FormStrings> = {
  en: {
    namePh: 'Your name',
    emailPh: 'Your email',
    messagePh: 'What do you do, and what do you need? (a few words is fine)',
    send: 'Send message',
    sending: 'Sending…',
    success: "Got it — I'll get back to you shortly. Thank you!",
    error: "Something went wrong. Please try WhatsApp or call, and I'll make it right.",
  },
  es: {
    namePh: 'Su nombre',
    emailPh: 'Su correo',
    messagePh: '¿A qué se dedica y qué necesita? (con unas palabras basta)',
    send: 'Enviar mensaje',
    sending: 'Enviando…',
    success: 'Recibido — le respondo muy pronto. ¡Gracias!',
    error: 'Algo salió mal. Escríbame por WhatsApp o llame, y lo resolvemos.',
  },
  pt: {
    namePh: 'Seu nome',
    emailPh: 'Seu e-mail',
    messagePh: 'O que você faz e do que precisa? (algumas palavras já bastam)',
    send: 'Enviar mensagem',
    sending: 'Enviando…',
    success: 'Recebido — respondo pra você em breve. Obrigado!',
    error: 'Algo deu errado. Chama no WhatsApp ou liga, e a gente resolve.',
  },
  hi: {
    namePh: 'आपका नाम',
    emailPh: 'आपका ईमेल',
    messagePh: 'आप क्या करते हैं और क्या चाहिए? (दो-चार शब्द ही काफ़ी हैं)',
    send: 'मैसेज भेजें',
    sending: 'भेज रहे हैं…',
    success: 'मिल गया — मैं जल्दी ही आपसे संपर्क करूँगा। धन्यवाद!',
    error: 'कुछ गड़बड़ हो गई। WhatsApp या कॉल करें, मैं सब ठीक कर दूँगा।',
  },
};

/** Saved choice wins; otherwise match the browser/phone language; default English. */
export function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    if (saved === 'en' || saved === 'es' || saved === 'pt' || saved === 'hi') return saved;
  } catch {
    // Storage unavailable — fall through to browser language detection
  }
  const candidates = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const candidate of candidates) {
    const base = candidate?.toLowerCase().split('-')[0];
    if (base === 'pt') return 'pt';
    if (base === 'es') return 'es';
    if (base === 'hi') return 'hi';
    if (base === 'en') return 'en';
  }
  return 'en';
}
