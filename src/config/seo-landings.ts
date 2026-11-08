import {
  FREE_QUOTA,
  HOME_KEYWORD,
  isSeoSlug,
  isStyleSlug,
  PRICE_PRO,
  PRICE_STARTER,
  PRICING_DESCRIPTION,
  PRICING_TITLE,
  PRO_QUOTA,
  PRODUCT_NAME,
  STARTER_QUOTA,
  type SeoSlug,
  type StyleSlug,
} from '@/config/seo-site';

export type InlinePart = string | { href: string; anchor: string };
export type RichParagraph = string | InlinePart[];

export type SeoFigure = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type SeoSection = {
  h2: string;
  paragraphs: RichParagraph[];
  figure?: SeoFigure;
};

export type SeoPage = {
  kind: 'style' | 'slug';
  slug: string;
  path: string;
  title: string;
  description: string;
  h1: string;
  keyword: string;
  /** Short label for the homepage scenario list and style-page cross-links. */
  navLabel?: string;
  /** Short home-card copy for style pages. Not repeated as the page opening. */
  summary?: string;
  sections: SeoSection[];
};

export type FaqItem = {
  question: string;
  answer: RichParagraph[];
};

function figure(
  src: string,
  detail: string,
  width = 1280,
  height = 720
): SeoFigure {
  return {
    src,
    alt: `AI motion graphics generator – ${detail}`,
    width,
    height,
  };
}

export function paragraphText(paragraph: RichParagraph): string {
  if (typeof paragraph === 'string') return paragraph;
  return paragraph
    .map((part) => (typeof part === 'string' ? part : part.anchor))
    .join('');
}

export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

export const COMPARISON_COLUMNS = [
  'Tool',
  'Prompt to video',
  'Edit text in finished video',
  'MP4 export',
  'Free plan',
] as const;

export const COMPARISON_FOOTNOTE =
  'Feature comparison is based on publicly documented behaviour as of November 2026 and may change.';

export type ComparisonRow = {
  tool: string;
  cells: readonly [string, string, string, string];
};

export const COMPARISON_ROWS: readonly ComparisonRow[] = [
  { tool: PRODUCT_NAME, cells: ['Yes', 'Yes', 'Yes', 'No'] },
  { tool: 'Magnific Move', cells: ['—', '—', '—', '—'] },
  { tool: 'Jitter', cells: ['—', '—', '—', '—'] },
  { tool: 'Opus Clip', cells: ['—', '—', '—', '—'] },
  { tool: 'easymotion', cells: ['—', '—', '—', '—'] },
];

const thumb = (slug: string, detail: string) =>
  figure(`/seo/style-${slug}.webp`, detail, 800, 450);

export const STYLE_PAGES: readonly SeoPage[] = [
  {
    kind: 'style',
    slug: 'social-media-ads',
    path: '/motion-graphics/social-media-ads',
    title: 'Social Media Ad Motion Graphics – Square and Vertical MP4',
    description:
      'Create social media ad motion graphics from a sentence. Update the offer text, colors, and timing, then export an MP4 for the feed.',
    h1: 'Social Media Ad Motion Graphics',
    keyword: 'Social media ads',
    navLabel: 'Social ads',
    summary:
      'Social media ads have to stay readable while they move, and the offer line usually changes after the first cut. Describe the product, the on-screen words, and the frame shape. Then click the text to update a price or a button label and export an MP4 for the placement you are buying.',
    sections: [
      {
        h2: 'A feed spot built around one offer',
        paragraphs: [
          'A social ad has one job in the first second: make the offer readable while the frame is still moving. Paid social is full of clips that look busy and say nothing. Start by naming the product, the audience, and the exact words that must be on screen, such as a price, a deadline, or a short benefit. Mention whether the frame is square, vertical, or a wide crop, because the same sentence will not sit comfortably in every placement.',
          'Keep the brief to the scene, not to software. You do not need to specify layers, masks, or easing. Say what enters, what the viewer should read, and what the last frame should leave them with. A clear sentence produces a first version you can judge. A vague sentence produces motion you then have to interpret. Write the line the way it should appear, including numerals and the words you refuse to paraphrase.',
        ],
        figure: thumb('social-media-ads', 'social media ad storyboard poster'),
      },
      {
        h2: 'Change the offer without reshooting the idea',
        paragraphs: [
          'Offers move. A price test, a new city, or a swapped call to action should not mean rebuilding the spot. After the video exists, click the text element and retype it. Change the button color if the brand kit shifted. Nudge the timing if the line appears before the product does. The picture stays; the words and the beats you care about are editable.',
          'That edit is the difference between a clip you tolerate and a file you can ship. Media buyers often learn the winning line after the design is already in motion. If the only way to fix a word is to prompt a brand new video and hope the rest stays put, you will burn generations on spelling. Clicking the element keeps the layout and replaces the copy.',
        ],
      },
      {
        h2: 'Export a file the ad account accepts',
        paragraphs: [
          'Export MP4 when the line is final. The offer is the whole spot: the price, the deadline, or the short benefit, written the way it has to appear, including the numerals you will not round. When a test changes that line, come back to the same frame. The picture you already approved is still the ad.',
          'Hand the MP4 to the person running the account. They should not need your project file, a font install, or a timeline. If a later test needs a different price, come back to the same elements, retype, and export again. The style stays a short, readable offer, not a miniature brand film.',
          'Square and vertical crops hide lines that were written for a wide frame. Watch the MP4 at the size of a phone and check the edges, including the space a platform covers with its own buttons. If a word is clipped, shorten that element instead of shrinking the whole scene. The offer has to survive the placement you are actually buying.',
        ],
      },
    ],
  },
  {
    kind: 'style',
    slug: 'youtube-intro',
    path: '/motion-graphics/youtube-intro',
    title: 'YouTube Intro Motion Graphics – A Short Open From a Prompt',
    description:
      'Make a YouTube intro with motion graphics. Type the channel name, fix the title card, and export a short MP4 open.',
    h1: 'YouTube Intro Motion Graphics',
    keyword: 'YouTube intro',
    navLabel: 'YouTube intros',
    summary:
      'A YouTube intro is a few seconds that names the channel and then gets out of the way. Describe the title card, generate the open, and retype the show name or the episode label if it is wrong. Export a short MP4 you can place in front of the edit without rebuilding a timeline.',
    sections: [
      {
        h2: 'An open that names the channel and leaves',
        paragraphs: [
          'Viewers forgive a short open and abandon a long one. A YouTube intro should show the channel or series name, a mark they will recognize next time, and then end. Describe that card in a sentence: the name as it must be spelled, the mood (quiet, loud, technical, playful), and roughly how brief you want the motion to feel. Do not ask for a trailer. Ask for an introduction.',
          'Episode-specific lines belong in the prompt too if they must be readable, such as a series title plus an episode number. Write them as the viewer should read them. Spoken-style nicknames and the legal show title are often different, and the frame should use the one you chose on purpose. The first generation is a proposal for that card, not a finished brand system.',
        ],
        figure: thumb('youtube-intro', 'YouTube intro title card poster'),
      },
      {
        h2: 'Retype the name when the channel changes',
        paragraphs: [
          'Channels rename, shows add a season number, and guest episodes need a different label. Click the text in the finished intro and replace it. Adjust color if the new art direction is darker or lighter than the first pass. Shift timing if the name appears before the mark has settled. You are editing the open you already approved, not gambling on a fresh prompt that might redesign the whole card.',
          'Keep the intro shorter than the patience of someone who clicked for the actual video. If a line is doing nothing, remove the words by replacing them with a shorter phrase rather than adding another animated object. Readability at the size of a phone, which is how a lot of YouTube is watched, matters more than a clever move that only works full screen.',
        ],
      },
      {
        h2: 'Drop an MP4 in front of the edit',
        paragraphs: [
          'Export MP4 and hand it to the editor, or drop it on the timeline yourself. An intro only has to name the channel, show a mark people will recognize next time, and then get out of the way. Episode numbers and guest labels change. The card they sit on should stay the one viewers already know.',
          'The editor should receive a normal video file. They should not need to match your fonts or reopen a motion project to publish the episode. When next month’s title changes, edit the text element and export a new MP4. The open stays recognizable because the scene did not have to be reinvented.',
          'Keep a still of the last frame next to the moving file. That still is what you check when a new episode label is only one character different and easy to miss in motion. If the still reads cleanly, the open is done. If it does not, fix the text element before the video goes in front of an upload.',
        ],
      },
    ],
  },
  {
    kind: 'style',
    slug: 'explainer-video',
    path: '/motion-graphics/explainer-video',
    title: 'Explainer Video Motion Graphics – Describe the Idea, Export MP4',
    description:
      'Turn one product idea into an explainer made of motion graphics. Edit the labels and timing, then export MP4.',
    h1: 'Explainer Video Motion Graphics',
    keyword: 'Explainer video',
    navLabel: 'Explainer videos',
    summary:
      'An explainer video walks through one idea with labels a viewer can actually read. Describe the steps in order, generate the scene, and click any label that needs a clearer word. Export an MP4 your site, deck, or sales note can play without opening a timeline.',
    sections: [
      {
        h2: 'One idea, told in order',
        paragraphs: [
          'An explainer fails when it tries to be a brochure. Pick one claim: what the product does, why a step exists, or how a number should be read. Describe the scenes in the order a new person would meet them. Put the words that must be read into the prompt as those words, not as a paraphrase you hope the picture will invent. Labels are the script.',
          'Say who it is for in the same brief. A buyer, a new hire, and a student do not need the same nouns. Mention the setting only if it carries meaning, such as a checkout, a dashboard, or a classroom. Skip camera jargon. You are asking for a clear sequence of motion graphics, with room to fix any label that comes back slightly wrong.',
        ],
        figure: thumb('explainer-video', 'explainer video label layout'),
      },
      {
        h2: 'Fix the label that confuses the step',
        paragraphs: [
          'The first render will usually get the order almost right and one label slightly off. Click that text and retype it in the language your viewer uses, including the shorter word your support team actually says. Change a color when two steps look too similar. Move timing so the label arrives with the object it names, not a beat early while the eye is elsewhere.',
          'Resist adding a second idea during the edit. If the video now explains two products, it explains neither. Keep the sequence you briefed and only correct the elements that are false or hard to read. That discipline is what makes the file useful in a help center, a sales deck, and a landing page without three different cuts.',
        ],
      },
      {
        h2: 'A file people can press play on',
        paragraphs: [
          'Export MP4 when the sequence still follows the one claim you briefed. A new person should be able to say that claim back after a single play, in the same order, using the nouns your team already says out loud. If a label is the only thing that moved, edit the label. Leave the path through the idea alone. The file is for someone who does not already know the product, so one clear path beats a second idea squeezed into the same minute.',
          'Publish the MP4 where the question is asked. A help article, a pricing page, and a sales follow-up can share the same file. When the product name changes, edit the text in the finished video and export again. The explanation stays stable because you did not have to restage it.',
          'Read the labels out loud once before you publish. An explainer that looks tidy can still use a noun your audience does not use. Replace that noun in the element, export again, and keep the sequence. The picture was never the part that needed a new idea.',
        ],
      },
    ],
  },
  {
    kind: 'style',
    slug: 'logo-animation',
    path: '/motion-graphics/logo-animation',
    title: 'Logo Animation Motion Graphics – Animate a Mark Without a Timeline',
    description:
      'Animate a logo with motion graphics. Describe the reveal, correct the wordmark, and export a clean MP4.',
    h1: 'Logo Animation Motion Graphics',
    keyword: 'Logo animation',
    navLabel: 'Logo animation',
    summary:
      'A logo animation reveals a mark and a wordmark without turning into a long brand film. Describe how the logo enters, generate the motion, then correct the spelling or the color on the wordmark. Export an MP4 that stays sharp on a site header, a title card, or the end of an ad.',
    sections: [
      {
        h2: 'A reveal for the mark you already have',
        paragraphs: [
          'Logo animation is a reveal, a settle, and a hold. Describe the mark in words the way a viewer would recognize it: the wordmark spelling, the rough shape of the symbol, and the background it has to sit on. Say whether the motion should feel quick or ceremonial. Ask for the name to be readable at the end, not only suggested by motion.',
          'If you have a required color, name it in plain language. If the background must be clear so an editor can place the move over footage, say that you need a transparent export and plan on Pro, which is the plan that includes it. The prompt is still about the reveal. It is not a request to invent a new logo.',
        ],
        figure: thumb('logo-animation', 'logo animation wordmark reveal'),
      },
      {
        h2: 'Correct the wordmark after you see it move',
        paragraphs: [
          'Spelling errors on a moving wordmark are expensive if the only fix is a new generation. Click the text and retype the name exactly, including capitalization and any mark you treat as part of the word. Adjust the color if the first pass picked a nearby shade instead of the brand color. Ease the timing if the letters settle before the symbol does, or the reverse.',
          'Hold the last frame long enough to read. A clever exit that hides the name is a failed logo animation. If the move is too busy, simplify by shortening the on-screen phrase rather than by adding more shapes. The mark should be the thing you remember, which means it has to sit still for a moment.',
        ],
      },
      {
        h2: 'Export for the header, the ad, or the editor',
        paragraphs: [
          'Export MP4 for a site, a deck, or the end of a spot. Watch the hold as if you had never seen the mark. The wordmark should be obvious after the motion stops, spelled the way you use it in public. If the entrance is clever and the still name is not, the reveal is not finished. Simplify until the settled frame is the thing you remember, then hand off that name rather than a project someone else has to rebuild.',
          'Deliver the file, not a project. A webmaster and a video editor can both use an MP4. When the wordmark gains a new letter after a rename, edit that element and export again so the reveal you liked does not get redesigned by accident.',
          'Check the hold on a dark background and a light one if the logo will sit in both places. A move that disappears into a white header is not finished. Recolor the element or export the transparent Pro file and let the page supply the background, instead of generating a second logo you did not ask for.',
        ],
      },
    ],
  },
  {
    kind: 'style',
    slug: 'kinetic-typography',
    path: '/motion-graphics/kinetic-typography',
    title: 'Kinetic Typography Motion Graphics – Words That Move on Cue',
    description:
      'Create kinetic typography from the sentence itself. Retype any word, shift color and timing, and export MP4.',
    h1: 'Kinetic Typography Motion Graphics',
    keyword: 'Kinetic typography',
    navLabel: 'Kinetic typography',
    summary:
      'Kinetic typography lets the sentence do the performing. Write the line you want seen, generate the motion, then retype any word that should hit harder. Change color and timing on that word and export an MP4 that can run without a voiceover if the text is doing the talking.',
    sections: [
      {
        h2: 'The sentence is the design',
        paragraphs: [
          'Kinetic type fails when the words are an afterthought on top of unrelated motion. Start with the sentence. Write it in the prompt exactly, including the word you want to land hardest. Say how it should feel: a steady read, a sudden emphasis, or a list that stacks. Mention the frame only so the line has room. Do not decorate the brief with objects that compete with the type.',
          'Short lines work better than paragraphs. If you need three sentences, consider three beats and say so, rather than one crowded card. Punctuation matters because it tells the motion where to breathe. A question and a command should not be animated as if they were the same kind of line. Put that difference in the prompt in ordinary language.',
        ],
        figure: thumb(
          'kinetic-typography',
          'kinetic typography line on screen'
        ),
      },
      {
        h2: 'Retype the word that carries the point',
        paragraphs: [
          'Once the line is moving, read it as a viewer who is not you. The weak word is usually obvious. Click it and replace it. Change its color if it must separate from the rest of the sentence. Shift its timing so it arrives on the beat you meant, not a half-second late when the eye has already left. Leave the words that are working alone.',
          'Do not restage the whole line to fix one verb. A new generation can reshuffle emphasis you already liked. Editing the element keeps the rhythm and corrects the language. That is the whole point of type-led motion: the copy is the material, so the copy has to stay changeable after you have seen it move.',
        ],
      },
      {
        h2: 'An MP4 that can play without narration',
        paragraphs: [
          'Export MP4 when the line reads cleanly with the sound off, because many people will meet it that way. The stressed word should be the one you wrote, arriving on the beat you meant, and staying long enough to read at a glance. A question and a command are different hits. Do not let the motion treat them as the same sentence.',
          'Use the file in an ad, a lyric-style caption, or a title sequence. If legal or brand asks for one word to change, edit that word in the finished video and export a replacement. The motion you approved does not have to be thrown away with the draft copy.',
          'If the line is doing the talking, mute your speakers and read it at the speed the motion allows. A word that flashes past is a word you should hold longer, not a word you should replace with a synonym. Timing is part of the sentence. Change it on the element before you ask for a new generation.',
        ],
      },
    ],
  },
  {
    kind: 'style',
    slug: 'data-stats-video',
    path: '/motion-graphics/data-stats-video',
    title: 'Data and Stats Motion Graphics – Figures You Can Still Edit',
    description:
      'Present one statistic as motion graphics. Update the number and label after generation, then export MP4.',
    h1: 'Data and Stats Motion Graphics',
    keyword: 'Data & stats video',
    navLabel: 'Data videos',
    summary:
      'A data and stats video puts one figure on screen and makes the comparison obvious. Describe the number, the label, and the context around it. After generation, click the figure when the source changes, adjust color or timing, and export an MP4 that still matches the citation.',
    sections: [
      {
        h2: 'One figure, with the label that explains it',
        paragraphs: [
          'A statistic on screen is a claim. Describe the number exactly, the unit, and the short label that says what it measures. Add the comparison only if it fits in the same glance, such as this quarter against the last one. Do not ask for a dashboard. Ask for one figure a person can repeat after the video ends. Put the source wording in the prompt if the label has to match a report.',
          'Say what must not be rounded away. A rate, a currency, and a count are different kinds of precision. If the number is 3.5 and not 4, write 3.5. Motion will not know your rounding rule. Context can be a single phrase under the figure. A paragraph of methodology belongs in the caption of the post, not inside the moving frame.',
        ],
        figure: thumb('data-stats-video', 'statistic figure and label'),
      },
      {
        h2: 'Update the number when the source changes',
        paragraphs: [
          'Figures go stale. Click the number in the finished video and replace it when the report updates. Click the label if the metric was renamed. Change color if a positive result and a negative result should not share a hue. Adjust timing so the figure arrives when you say it, or just before, if the video will be watched without sound.',
          'Keep the layout. A new prompt can invent a different chart for the same fact, which makes a series of updates look like unrelated clips. Editing the element preserves the frame your audience already learned how to read. That consistency matters more than a novel transition between two versions of the same statistic.',
        ],
      },
      {
        h2: 'Export the citation as a normal video',
        paragraphs: [
          'Export MP4 and place it next to the written source. One figure is the whole video: the number, the unit, and a label short enough to repeat after the clip ends. A second metric, or a paragraph of methodology, does not belong in the moving frame. When the report updates, change the citation in this picture instead of starting a new style. The frame should still agree with the report when someone screenshots it on its own.',
          'If the number was wrong, do not publish a correction as a second style. Retype the figure in the video you already have and export again. The audience sees the same frame with the right value, which is what a correction should look like.',
          'Put the unit in the label, not only in the caption under the post. A moving 12 can mean percent, dollars, or weeks, and the frame is often screenshotted without the caption. Click the label until the unit is visible, then export. The citation and the picture should agree even when they are separated.',
        ],
      },
    ],
  },
];

/** One commercial line for every style page. Prices live in full on /pricing. */
export const STYLE_PLAN_LINE: RichParagraph = [
  `Starter is ${PRICE_STARTER} for ${STARTER_QUOTA} generations. Pro is ${PRICE_PRO} for ${PRO_QUOTA} generations. There is no free generation quota. See `,
  { href: '/pricing', anchor: 'pricing' },
  ' for what each plan includes.',
];

/**
 * Three related style pages per scenario. The undirected graph is connected
 * and every page is linked from at least one other page.
 */
export const STYLE_RELATED: Record<
  StyleSlug,
  readonly [StyleSlug, StyleSlug, StyleSlug]
> = {
  'social-media-ads': [
    'kinetic-typography',
    'explainer-video',
    'data-stats-video',
  ],
  'youtube-intro': ['logo-animation', 'kinetic-typography', 'social-media-ads'],
  'explainer-video': [
    'data-stats-video',
    'social-media-ads',
    'kinetic-typography',
  ],
  'logo-animation': ['youtube-intro', 'kinetic-typography', 'social-media-ads'],
  'kinetic-typography': ['logo-animation', 'youtube-intro', 'social-media-ads'],
  'data-stats-video': [
    'explainer-video',
    'social-media-ads',
    'kinetic-typography',
  ],
};

export const SEO_SLUG_PAGES: readonly SeoPage[] = [
  {
    kind: 'slug',
    slug: 'ai-motion-video-generator',
    path: '/ai-motion-video-generator',
    title: 'AI Motion Video Generator – Prompt to MP4 Video',
    description:
      'Type a prompt, generate motion graphics, edit the elements, and export an MP4. Starter and Pro are the only plans.',
    h1: 'AI Motion Video Generator',
    keyword: 'AI Motion Video Generator',
    sections: [
      {
        h2: 'From a sentence to a file you can post',
        paragraphs: [
          `An AI motion video generator is worthwhile only if it ends in a file other people can play. ${PRODUCT_NAME} takes a written scene, builds a first motion-graphics version, lets you click elements to change them, and exports MP4. The prompt is the brief. The export is the delivery. Everything between those two is an edit, not a second career in timeline software.`,
          'Write the words that must be readable, not a vibe in place of copy. Include the frame if it matters: vertical for a phone feed, wide for a title, square for a post. Mention one mood. Then stop. A long prompt full of conflicting styles produces a frame that cannot be repaired by a single click, because too many things are wrong at once.',
        ],
        figure: figure(
          '/seo/page-video.webp',
          'prompt field beside an MP4 export'
        ),
      },
      {
        h2: 'Spend generations on new scenes, not on typos',
        paragraphs: [
          `Each generation is a new scene. Starter includes ${STARTER_QUOTA} a month at ${PRICE_STARTER}. Pro includes ${PRO_QUOTA} a month at ${PRICE_PRO}. There is no free quota on top of that, so a typo should not cost a generation. Click the text in the finished video and retype it. Change color and timing the same way. Generate again only when the idea itself is different.`,
          'That split is the working method. Prompt for the scene. Edit for the corrections. Export when the corrections are done. If you re-prompt for every copy change, you will exhaust a month of Starter on variants that should have been clicks. The editor exists so the file can improve without pretending to be a new video.',
        ],
      },
      {
        h2: 'What the MP4 includes',
        paragraphs: [
          'Starter exports 1080p with no watermark and a commercial license. You can post it, run it as an ad, or give it to a client under that license. Pro adds 4K and a transparent background export, plus a priority queue when time is short. Transparent export is for placing the motion over other footage. If you do not need that, Starter’s MP4 is a complete delivery.',
          'The file does not require the person downstream to own the tool. An editor, a webmaster, and an ad account can all take MP4. If they ask for a project file, you can still hand them the video and, when a line must change, perform that change yourself in the element editor and send a new MP4.',
        ],
      },
      {
        h2: 'Before you press generate',
        paragraphs: [
          'Read the sentence aloud. If you stumble, the viewer will too. Check numerals, names, and the one claim you are willing to put on screen. Decide the plan before you need the file the same afternoon: Starter for a regular cadence at 1080p, Pro for more renders, 4K, or a cutout background. The prompt box on the homepage accepts the sentence before sign-in so you can do this reading first.',
          'Then generate, edit the elements that are wrong, and export. If you are choosing a style — a feed ad, an intro, an explainer, a logo move, type-led motion, or a single statistic — start from that style page so the brief matches the job. The generator is the same path in each case. The sentence is what changes.',
          'Keep the prompt next to the file name you export. When someone asks for a small change weeks later, you will want the original sentence and the element you already edited, not a memory of the mood. A generator that ends in MP4 is a delivery tool. Treat the download as the record, and treat a new generation as a new record, so a month of Starter stays a month of scenes rather than a month of discarded drafts. Play the file once on a phone before you send it. If the words survive that size, the export is finished. If they do not, edit the element and export again instead of starting a new scene.',
        ],
      },
    ],
  },
  {
    kind: 'slug',
    slug: 'motion-graphics-editor',
    path: '/motion-graphics-editor',
    title: 'Motion Graphics Editor – Click Any Element to Edit',
    description:
      'Click text, color, and timing in a finished motion-graphics video, then export MP4. No timeline experience required.',
    h1: 'Motion Graphics Editor',
    keyword: 'Motion Graphics Editor',
    sections: [
      {
        h2: 'Edit the video you already generated',
        paragraphs: [
          `A motion graphics editor, in this product, is not a stack of tracks. After ${PRODUCT_NAME} generates a scene, you click an element in that finished video. Text can be retyped. Color can be changed. Timing can move so a word or a shape arrives earlier or later. The rest of the scene stays where it was. You are correcting a result, not rebuilding a composition from empty tracks.`,
          'This matters because the first generation is rarely the last copy. Prices, names, and labels change after you see them in motion. A timeline tool asks you to find the layer that owns the glyph. Clicking the element asks you to point at the thing that looks wrong. That is the skill the page is built around, and it is the skill most people already have.',
        ],
        figure: figure(
          '/seo/page-editor.webp',
          'clicking a text element to retype it'
        ),
      },
      {
        h2: 'What a click is allowed to change',
        paragraphs: [
          'Retype any on-screen text: a price, a name, a button label, a statistic. Change the color of an element when the brand color was missed or two objects need to separate. Change timing when a beat is early or late. Do not expect a click to invent a new scene, a new character, or a different aspect ratio. Those are new generations, and they draw from the monthly quota.',
          `Starter (${PRICE_STARTER}, ${STARTER_QUOTA} generations, 1080p, no watermark, commercial license) and Pro (${PRICE_PRO}, ${PRO_QUOTA} generations, 4K, transparent background, priority queue) both include this editing. There is no free plan that locks editing behind a watermark. If you have not bought a plan, you can still write the prompt. You cannot spend a generation you have not paid for.`,
        ],
      },
      {
        h2: 'A short editing pass',
        paragraphs: [
          'Play the scene once with the sound off and read every word. Click the first word that is wrong and replace it before you touch color. Then look for the element whose color fights the text. Then watch the timing: if the important word arrives while something else is still entering, delay that other element or advance the word. Export MP4 after that pass, not after an hour of ornamental tweaks.',
          'Keep a note of the sentence you meant. The editor will let you type something new that no longer matches the claim you approved. That is your responsibility, the same as in any design tool. The software will not check your price against a spreadsheet. It will put the characters you typed on the element you clicked.',
        ],
      },
      {
        h2: 'When to generate again instead',
        paragraphs: [
          'Generate a new scene when the layout is the problem: the wrong number of objects, the wrong frame, or a mood so far off that recoloring will not save it. Edit when the layout is acceptable and the content is not. Mixing those up is how a quota disappears. The homepage walks through describe, click, and export in that order so the editor is a step, not a separate product you have to learn first.',
          'If you came here from a style — ads, intros, explainers, logos, type, or a statistic — go back to that page for the brief, then return to the element click when the render exists. The editor is the same gesture in each style. Only the element you care about changes.',
          'Name the element in your own notes if several text blocks look alike, such as “price” and “button.” Click one, change it, and play the scene before you touch the next. Batch edits that you do not replay are how a corrected price lands on the wrong line. The editor is fast because it is literal. It will change the thing you clicked, including the thing you clicked by mistake, and the MP4 will show whichever version you exported last. Export only after that replay, when the line you read matches the line you meant.',
        ],
      },
    ],
  },
  {
    kind: 'slug',
    slug: 'how-to-use-magnific-move',
    path: '/how-to-use-magnific-move',
    title: 'How to Use Magnific Move (Step by Step)',
    description:
      'What we will and will not say about Magnific Move, plus the Aniform steps for prompt, element edit, and MP4 export.',
    h1: 'How to Use Magnific Move',
    keyword: 'How to Use Magnific Move',
    sections: [
      {
        h2: 'Why this is not a borrowed manual',
        paragraphs: [
          'A step-by-step for someone else’s product goes stale the week their interface moves, and it becomes false the moment it invents a button. This page does not publish click-paths, menu names, or feature claims for Magnific Move. The homepage comparison marks that tool with a dash for prompt-to-video, editing text in a finished video, MP4 export, and a free plan. A dash means “not stated here.” It does not mean yes, and it does not mean no.',
          `The comparison is dated November 2026 and can change. If you need their current behavior, use their own documentation. What follows is the workflow people are usually trying to complete when they search for a how-to: describe a scene, change the words after they see them, and leave with an MP4. That workflow is documented here for ${PRODUCT_NAME} only.`,
        ],
        figure: figure(
          '/seo/page-magnific-how.webp',
          'three-step prompt edit export diagram'
        ),
      },
      {
        h2: 'The three steps we can actually teach',
        paragraphs: [
          `Step one is the sentence. On the ${PRODUCT_NAME} homepage, type what is on screen, the exact text a viewer must read, and the frame. You can do this before you sign in. The field does not spend a generation and it does not start a free render. ${FREE_QUOTA === 0 ? 'There is no free generation quota.' : `Free quota is ${FREE_QUOTA}.`} Starter is ${PRICE_STARTER} for ${STARTER_QUOTA} generations. Pro is ${PRICE_PRO} for ${PRO_QUOTA}.`,
          'Step two is the click. After a paid generation, select the element that is wrong. Retype the text, change the color, or move the timing. Do not open a timeline and do not hunt for a layer name. If the whole idea is wrong, generate again instead of forcing the editor to become a different scene. Step three is export. Starter delivers 1080p MP4 with no watermark and a commercial license. Pro adds 4K, transparent background export, and a priority queue.',
        ],
      },
      {
        h2: 'How to judge a tool without a rumor',
        paragraphs: [
          'Use four questions, the same four columns as the table. Can you go from a prompt to a video? Can you edit text in the finished video? Can you export MP4? Is there a free plan? For any tool we have not documented, leave the answer blank until you have seen it yourself. Filling a blank with a guess helps a landing page and hurts a buyer. This page leaves Magnific Move blank on purpose.',
          `Apply the same four questions to ${PRODUCT_NAME} and you get yes, yes, yes, and no. The no is the free plan. We would rather print the no than imply a trial we do not sell. If a guide elsewhere promises free Magnific Move output, that claim is not one we are repeating, confirming, or denying.`,
        ],
      },
      {
        h2: 'Where to go next',
        paragraphs: [
          'If you want the product workflow with pictures of each step, use the homepage. If you want a page that frames an alternative without inventing missing features, read on to the alternative page. If you want the boundary of this review — what is scored and what is refused — use the review page. All three stay inside the same rule: no invented competitor cells, no copied marketing lines, no free quota that the pricing table does not list.',
          'When you are ready to produce a file, write the sentence, buy the plan that matches the export you need, generate, click what is wrong, and download MP4. That is the entire method. It does not require a parallel set of instructions for a different product’s menus.',
          'If a tutorial site lists clicks we do not list, treat that list as unverified. Menus move, and a screenshot from last year is not a procedure you should paste into a client doc. The procedure on this page is short because it only includes steps we ship: write, generate on a paid plan, click the element, export. Anything longer would be borrowing a product we are not willing to describe button by button.',
        ],
      },
    ],
  },
  {
    kind: 'slug',
    slug: 'magnific-move-alternative',
    path: '/magnific-move-alternative',
    title: 'Magnific Move Alternative – Editable Text After Generation',
    description:
      'Aniform as a Magnific Move alternative: prompt, editable text after generation, MP4 export, and no free plan. Competitor cells stay blank.',
    h1: 'Magnific Move Alternative',
    keyword: 'Magnific Move Alternative',
    sections: [
      {
        h2: 'An alternative stated only in our own columns',
        paragraphs: [
          `Calling ${PRODUCT_NAME} a Magnific Move alternative means you can do a specific job here: describe motion graphics, change the text after the video exists, and export MP4. It does not mean we have measured their product and found it lacking. The comparison table prints a dash in every Magnific Move cell. Those dashes are the whole of our public statement about them as of November 2026.`,
          'Buyers still need a way to choose. The fair way is to list what we do, in words we can keep true, and to send you to the other product for their own account of what they do. This page is that list. It is not a teardown, a feature matrix we do not have, or a rewrite of anyone else’s homepage.',
        ],
        figure: figure(
          '/seo/page-magnific-alternative.webp',
          'editable text after a generation'
        ),
      },
      {
        h2: 'Editable text is the reason to switch tools',
        paragraphs: [
          'The painful moment in generated video is the almost-right take: the motion is fine and one word is wrong. If the fix is a brand new roll of the dice, you do not have an editor. You have a slot machine. Here, you click the text in the finished video and retype it. You can change color and timing on that element too. The scene you already accepted does not have to be forfeited to correct a label.',
          `That behavior is a yes in our column for “edit text in finished video.” It is not a statement about whether Magnific Move can do the same. If they can, you may still prefer a tool whose price and quota you can read on one screen. If they cannot, you will discover that in their docs, not in a cell we invented. Our yes stands on its own.`,
        ],
      },
      {
        h2: 'Price, quota, and the missing free row',
        paragraphs: [
          `Starter is ${PRICE_STARTER} for ${STARTER_QUOTA} generations a month, 1080p, no watermark, and a commercial license. Pro is ${PRICE_PRO} for ${PRO_QUOTA} generations, 4K, transparent background export, and a priority queue. Free generations: ${FREE_QUOTA}. There is no third plan and no unpaid render pack. A search for a free alternative will land on a straight answer rather than a coupon we do not have.`,
          'Commercial use is part of both paid plans, not an upgrade buried under an enterprise call. Watermarks are not held back as a punishment for a free tier, because that tier is not on the table. If your alternative checklist includes “can I ship the file to a client,” the license on Starter already says yes. You do not need Pro unless you need the extra quota, 4K, the transparent export, or the queue.',
        ],
      },
      {
        h2: 'How to try the path without a rumor',
        paragraphs: [
          'Type the scene you would have taken to any other tool. Use the homepage prompt. Read it back. If the sentence is the one you want on screen, sign in and generate on the plan you chose. Click the element that came back wrong. Export MP4. Judge the alternative by that file, not by an adjective in a headline.',
          'Then, if you still need the other product in the decision, open their current documentation and answer the four table questions yourself. Bring those answers back and compare them to a yes, a yes, a yes, and a no. That is a comparison you can defend. A page full of guessed checkmarks is not.',
          'An alternative is allowed to be narrower than the thing it is compared with. We are not claiming a larger feature set. We are claiming a path you can finish: a sentence, a click on the wrong word, and an MP4 with a commercial license. If that path is the one you needed, the rest of the category can stay unscored. If you needed a capability we have not said yes to, this is the wrong alternative, and the blank cells are your reminder to go look it up rather than assume.',
        ],
      },
    ],
  },
  {
    kind: 'slug',
    slug: 'magnific-move-review',
    path: '/magnific-move-review',
    title: 'Magnific Move Review: What It Does and Where It Stops',
    description:
      'A Magnific Move review that scores only documented claims. Unstated features stay blank. Aniform’s own yes and no columns are listed beside them.',
    h1: 'Magnific Move Review',
    keyword: 'Magnific Move Review',
    sections: [
      {
        h2: 'What this review refuses to do',
        paragraphs: [
          'A review that invents features is an ad with a serious tone. This one declines. We do not describe Magnific Move’s interface, we do not repeat their marketing lines, and we do not fill gaps with what a category of tools “usually” does. As of November 2026 the public table on our homepage shows a dash for them on prompt-to-video, editing text in a finished video, MP4 export, and a free plan. This review explains those dashes and then scores our own product in the same columns, where we do have the facts.',
          'Dashes are allowed to stay dashes. Updating them requires a source we are willing to stand next to, not a memory of a demo or a sentence from a roundup. Until that source is in our own comparison, the honest review is mostly a boundary. Readers who wanted a verdict dressed as certainty will not find it here, and that is intentional.',
        ],
        figure: figure(
          '/seo/page-magnific-review.webp',
          'comparison table with blank competitor cells'
        ),
      },
      {
        h2: 'The four questions, applied to us',
        paragraphs: [
          `Prompt to video: yes. You describe a motion-graphics scene and ${PRODUCT_NAME} generates a first version. Edit text in the finished video: yes. You click the element and retype it, and you can change color and timing without a new generation. MP4 export: yes. Starter is 1080p with no watermark. Pro adds 4K and a transparent background. Free plan: no. ${FREE_QUOTA} free generations. Starter is ${PRICE_STARTER} for ${STARTER_QUOTA} generations and a commercial license. Pro is ${PRICE_PRO} for ${PRO_QUOTA} generations and a priority queue.`,
          'Those four answers are the review we can publish without borrowing anyone else’s product. They are also the answers a buyer can check by reading the pricing block and using the editor. If one of them changes, the table and this page have to change together. A review that drifts away from the price list is how free tiers get invented by accident.',
        ],
      },
      {
        h2: 'Where a generated video usually stops',
        paragraphs: [
          'Generated motion stops being useful at the moment a required word is wrong and the tool offers only “try again.” That is the stop this product is built to move. The stop we will not pretend to measure is someone else’s. If Magnific Move already lets you edit finished text, our dash is ignorance, not an attack. If it does not, their customers already know, and they do not need us to announce it without a citation.',
          'Other rows in the same table — Jitter, Opus Clip, and easymotion — are treated the same way. Familiar names are not permission to score them. A review page with one famous name in the title still does not earn the right to invent the rest of the category. The footnote on the table applies here: publicly documented behaviour, November 2026, and it may change.',
        ],
      },
      {
        h2: 'What to do with a non-verdict',
        paragraphs: [
          'Use this page as a checklist, not a winner’s podium. Write down the four questions. Fill our row from the paragraphs above. Fill any other row only from documents you have read this month. If a cell stays empty, leave it empty in the notes you send a client. Empty is a real status. It means you have not verified the claim, which is a better position than repeating one.',
          `If the job is simply to leave with an MP4 you can still edit, you already have a product that says yes on the first three questions and no on the fourth. Start on the homepage, use Starter or Pro, and skip any guide that offers a free generation ${PRODUCT_NAME} does not sell.`,
          'Revisit the dashes when the date in the footnote moves. A review that never updates is a review that slowly becomes fiction. Until then, quote our row if you need a source, and quote nothing about the other rows. The useful outcome of this page is a buyer who can tell a documented yes from an empty cell, and who will not pay for a free tier that was only a heading.',
        ],
      },
    ],
  },
];

const styleBySlug = new Map(STYLE_PAGES.map((page) => [page.slug, page]));
const seoBySlug = new Map(SEO_SLUG_PAGES.map((page) => [page.slug, page]));

export function getStylePage(slug: string): SeoPage | undefined {
  if (!isStyleSlug(slug)) return undefined;
  return styleBySlug.get(slug);
}

export function relatedStylePages(slug: string): SeoPage[] {
  if (!isStyleSlug(slug)) return [];
  return STYLE_RELATED[slug].flatMap((related) => {
    const page = styleBySlug.get(related);
    return page ? [page] : [];
  });
}

export function getSeoPage(slug: string): SeoPage | undefined {
  if (!isSeoSlug(slug)) return undefined;
  return seoBySlug.get(slug);
}

export function pageBySlug(
  slug: SeoSlug | StyleSlug | string
): SeoPage | undefined {
  return seoBySlug.get(slug) ?? styleBySlug.get(slug);
}

/**
 * Public URLs that belong in the sitemap but must not join the canonical
 * redirect set. `/pricing` and `/ai-video-generator` accept query state
 * (`plan`, `prompt`, `model`, `startImageUrl`). Stripping that query would
 * drop a checkout or a generator handoff.
 *
 * `/prompts` and `/showcases` stay out of both lists. They are public
 * gallery shells — a heading plus a grid loaded from the API — not
 * indexable marketing pages.
 */
const SITEMAP_EXTRA_PATHS = ['/pricing', '/ai-video-generator'] as const;

function seoIndexablePaths(): string[] {
  return [
    '/',
    ...STYLE_PAGES.map((page) => page.path),
    ...SEO_SLUG_PAGES.map((page) => page.path),
  ];
}

export function seoSitemapPaths(): string[] {
  return [...seoIndexablePaths(), ...SITEMAP_EXTRA_PATHS];
}

/**
 * Former landings. They are not rendered and not in the sitemap.
 * `src/server.ts` turns the returned path into a 301, same as the www→apex
 * host redirect. `/free-motion-graphics-generator` used the homepage keyword,
 * so it now points at `/`.
 */
const RETIRED_SEO_PATHS: Readonly<Record<string, string>> = {
  '/free-motion-graphics-generator': '/',
};

/** GET/HEAD status used by the server canonical redirect. */
export const SEO_PATH_REDIRECT_STATUS = 301;

function normalizePathname(pathname: string): string {
  const trimmed = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  return trimmed === '' ? '/' : trimmed;
}

/** 301 target for a retired slug or path, or null when the URL is still live. */
export function retiredSeoTarget(slugOrPath: string): string | null {
  const raw = slugOrPath.startsWith('/') ? slugOrPath : `/${slugOrPath}`;
  return RETIRED_SEO_PATHS[normalizePathname(raw)] ?? null;
}

/** Same-origin path to 301 to, or null when the request is already canonical. */
export function seoPathRedirect(url: URL): string | null {
  const indexable = new Set(seoIndexablePaths());
  let pathname = url.pathname;
  let strippedLocale = false;

  if (pathname === '/zh' || pathname.startsWith('/zh/')) {
    const rest = pathname === '/zh' ? '/' : pathname.slice(3) || '/';
    const normalized = normalizePathname(rest);
    if (indexable.has(normalized) || retiredSeoTarget(normalized)) {
      pathname = rest;
      strippedLocale = true;
    }
  }

  const trimmed = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  const path = trimmed === '' ? '/' : trimmed;
  const retired = retiredSeoTarget(path);
  if (retired) return retired;
  if (!indexable.has(path)) return null;
  const dirty = strippedLocale || trimmed !== pathname || url.search.length > 0;
  if (!dirty) return null;
  return path;
}

export const HOME_H1 = HOME_KEYWORD;

export const HOME_WHAT_IS = {
  h2: 'What is an AI motion graphics generator?',
  paragraphs: [
    'Motion graphics are titles, shapes, icons, and short scenes that move on purpose. An ai motion graphics generator writes the first version of that scene from a sentence, so you start with a picture that already moves instead of an empty timeline and a stack of layers.',
    'The useful part comes after the first render. You describe the shot, generate it, then click a single element to retype the words, change a color, or shift when it appears. Nothing has to be rebuilt from a keyframe graph just because a price or a name was wrong.',
    `When the scene is right, export an MP4. Starter covers 1080p with no watermark and a commercial license. Pro covers 4K, a transparent background, and a faster queue. The work is describe, generate, edit the elements, and export, not a class in timeline software.`,
  ],
};

export const HOME_STEPS: {
  h3: string;
  paragraphs: RichParagraph[];
  figure: SeoFigure;
}[] = [
  {
    h3: 'Step 1: Describe the animation',
    paragraphs: [
      'Write one or two sentences about the scene. Say what is on screen, the exact words a viewer must read, and whether the frame is vertical, square, or wide. Add a mood if it matters, such as calm, loud, or technical. You do not name layers or easing curves. The prompt field on this page takes that description before an account exists, so you can shape the request first.',
    ],
    figure: figure('/seo/step-describe.webp', 'prompt describing an animation'),
  },
  {
    h3: 'Step 2: Click any element to edit it',
    paragraphs: [
      [
        'Generation is the start, not the lock. Open the finished frame and click the element that is wrong. Retype a price, a name, or a call to action. Change a fill color. Move a beat so the word lands with the motion. This is what a ',
        {
          href: '/motion-graphics-editor',
          anchor: 'Motion Graphics Editor',
        },
        ' is for: changing the video you already have, instead of redrawing the spot because one line changed.',
      ],
    ],
    figure: figure('/seo/step-edit.webp', 'clicking an element to edit text'),
  },
  {
    h3: 'Step 3: Export MP4',
    paragraphs: [
      [
        `Download an MP4 when the edit is done. The file is a normal video you can post, embed, or hand to someone else. Starter exports 1080p with the watermark removed and a commercial license. Pro adds 4K, a transparent background, and a priority queue. Use an `,
        {
          href: '/ai-motion-video-generator',
          anchor: 'AI Motion Video Generator',
        },
        ' when the goal is a prompt that becomes that file, not a project trapped in a timeline.',
      ],
    ],
    figure: figure('/seo/step-export.webp', 'MP4 export of a finished scene'),
  },
];

export const HOME_HOW_INTRO =
  'Three steps take a sentence to a file. The prompt, the click, and the export stay in that order so a typo does not cost a new scene.';

export const HOME_STYLES_INTRO =
  'Pick the job first. Each style has its own page, its own brief, and the same path from a sentence to an MP4.';

export const HOME_AUDIENCE_INTRO =
  'The same editor serves three kinds of deadline. The sentence changes. The export does not.';

export const HOME_FAQ_INTRO =
  'Straight answers about price, editing, export, and commercial use.';

export const HOME_AUDIENCE: { h3: string; paragraph: string }[] = [
  {
    h3: 'Marketers',
    paragraph:
      'You are shipping an offer, not a showreel. Write the price and the button label into the prompt, then click those elements when the campaign changes. Export an MP4 the ad account can run. You do not need a motion designer on the thread for a line edit, and you do not have a free pile of generations to burn on spelling.',
  },
  {
    h3: 'YouTubers',
    paragraph:
      'You need an open that says the channel name and ends. Describe the card, generate it, and retype the series or episode label when the next video is different. Export a short MP4 and put it in front of the episode. The work fits between scripts, without a separate afternoon inside a timeline.',
  },
  {
    h3: 'Agencies',
    paragraph:
      'Clients change the line after they have approved the picture. Click the text, retype it, and export again under a commercial license instead of reopening a project. Starter covers a modest monthly count at 1080p. Pro is there when the account needs more renders, 4K, or a transparent file for someone else’s edit.',
  },
];

export const HOME_COMPARISON_INTRO =
  'The table below scores one product on four questions and leaves every other cell blank. A dash means this page is not stating that capability. Nothing here is a guess about another company’s feature list.';

export const HOME_COMPARISON_AFTER: RichParagraph = [
  'If you are comparing products by name, read ',
  {
    href: '/how-to-use-magnific-move',
    anchor: 'How to Use Magnific Move',
  },
  ', then ',
  {
    href: '/magnific-move-alternative',
    anchor: 'Magnific Move Alternative',
  },
  ' and ',
  {
    href: '/magnific-move-review',
    anchor: 'Magnific Move Review',
  },
  '. Those pages stay inside what we can actually say.',
];

export function homePricingIntro(): string {
  return `Two paid plans. ${PRODUCT_NAME} does not include a free generation quota, so this section has no free row.`;
}

/** Public /pricing copy. Same commercial facts as the homepage, no credit packs. */
export function pricingPageModel(): {
  h1: string;
  title: string;
  description: string;
  intro: string;
  plans: { h3: string; paragraph: string }[];
  faq: { question: string; answer: string }[];
} {
  return {
    h1: PRICING_TITLE,
    title: PRICING_TITLE,
    description: PRICING_DESCRIPTION,
    intro: `Two monthly plans. ${PRODUCT_NAME} does not include a free generation quota.`,
    plans: homePlanCopy(),
    faq: [
      {
        question: 'Is there a free generation quota?',
        answer: `${PRODUCT_NAME} does not offer a free generation quota. You can type a prompt before you sign in. Rendering a video spends a paid generation.`,
      },
      {
        question: 'What do the monthly plans include?',
        answer: `Starter is ${PRICE_STARTER} and includes ${STARTER_QUOTA} generations each month, 1080p, no watermark, and a commercial license. Pro is ${PRICE_PRO} and includes ${PRO_QUOTA} generations each month, 4K, transparent background export, and a priority queue.`,
      },
      {
        question: 'Are these monthly plans?',
        answer: `Yes. Starter and Pro are monthly plans. ${PRODUCT_NAME} does not sell one-time credit packs.`,
      },
    ],
  };
}

export function homePlanCopy(): { h3: string; paragraph: string }[] {
  return [
    {
      h3: `Starter (${PRICE_STARTER})`,
      paragraph: `${STARTER_QUOTA} generations each month, 1080p, no watermark, and a commercial license. This is the entry plan. Rendering a video uses one of those generations. Typing a prompt on the page does not.`,
    },
    {
      h3: `Pro (${PRICE_PRO})`,
      paragraph: `${PRO_QUOTA} generations each month, 4K, transparent background export, and a priority queue. Use it when you need more renders, a larger master, or a file with the background removed.`,
    },
  ];
}

export function homeFaq(): FaqItem[] {
  const freeNote =
    FREE_QUOTA > 0
      ? `${PRODUCT_NAME} includes ${FREE_QUOTA} free generations.`
      : `${PRODUCT_NAME} does not offer a free generation quota.`;

  return [
    {
      question: 'Is there a free AI motion graphics generator?',
      answer: [
        [
          `${freeNote} There is no complimentary render pack. Starter is ${PRICE_STARTER} with ${STARTER_QUOTA} generations a month, 1080p, no watermark, and a commercial license. Pro is ${PRICE_PRO} with ${PRO_QUOTA} generations, 4K, transparent background export, and a priority queue. You can type a prompt on this page before you sign in. Rendering a video spends a paid generation. The `,
          {
            href: '/motion-graphics-editor',
            anchor: 'Motion Graphics Editor',
          },
          ' is where you change text or style without a timeline.',
        ],
      ],
    },
    {
      question: 'How is this different from Magnific Move?',
      answer: [
        `${PRODUCT_NAME} can turn a prompt into a video, let you edit text in that finished video, and export MP4. It does not offer a free plan. Magnific Move is listed in the table with a dash in every column, because this site does not assert those four behaviors for it. A dash is not a no and not a yes. Read the Magnific Move pages linked above for the boundary of what we will claim.`,
      ],
    },
    {
      question: 'Can I edit the text after the video is generated?',
      answer: [
        'Yes. After the video is generated, click the text element and retype it. You can also change its color and when it appears. You do not rebuild a timeline to fix a word, a price, or a name.',
      ],
    },
    {
      question: 'Do I need motion design experience?',
      answer: [
        'No. You describe the scene in ordinary language and click elements to change them. You do not need keyframes, expressions, or a motion-design portfolio to export a usable MP4.',
      ],
    },
    {
      question: 'What format can I export?',
      answer: [
        `MP4. Starter exports at 1080p with no watermark. Pro adds 4K and a transparent background export. Both plans include a commercial license. There is no separate free-plan export, because there is no free plan.`,
      ],
    },
    {
      question: 'Can I use the output commercially?',
      answer: [
        `Yes. Starter and Pro both include a commercial license, so the MP4 can run in ads, client work, and channel branding. Paid exports are made without a watermark. There is no free plan with a testing-only watermark.`,
      ],
    },
  ];
}

export function collectPageText(page: SeoPage): string {
  const parts = [page.h1, page.title, page.description, page.summary ?? ''];
  for (const section of page.sections) {
    parts.push(section.h2);
    for (const paragraph of section.paragraphs) {
      parts.push(paragraphText(paragraph));
    }
  }
  return parts.join('\n');
}

export function homeBodyText(): string {
  const parts: string[] = [
    HOME_H1,
    HOME_WHAT_IS.h2,
    ...HOME_WHAT_IS.paragraphs,
  ];
  parts.push('How it works', HOME_HOW_INTRO);
  for (const step of HOME_STEPS) {
    parts.push(step.h3);
    for (const paragraph of step.paragraphs)
      parts.push(paragraphText(paragraph));
  }
  parts.push('Motion graphics styles', HOME_STYLES_INTRO);
  for (const page of STYLE_PAGES) parts.push(page.navLabel ?? '');
  for (const page of STYLE_PAGES) {
    parts.push(page.keyword, page.summary ?? '');
  }
  parts.push("Who it's for", HOME_AUDIENCE_INTRO);
  for (const group of HOME_AUDIENCE) {
    parts.push(group.h3, group.paragraph);
  }
  parts.push(
    'How it compares to other AI motion graphics tools',
    HOME_COMPARISON_INTRO,
    paragraphText(HOME_COMPARISON_AFTER),
    COMPARISON_FOOTNOTE
  );
  parts.push('Pricing', homePricingIntro());
  for (const plan of homePlanCopy()) parts.push(plan.h3, plan.paragraph);
  parts.push('FAQ', HOME_FAQ_INTRO);
  for (const item of homeFaq()) {
    parts.push(item.question);
    for (const paragraph of item.answer) parts.push(paragraphText(paragraph));
  }
  return parts.join('\n');
}

export const DEMO_POSTER = figure(
  '/seo/demo-poster.webp',
  'demo poster of a prompt-built scene'
);

export const DEMO_VIDEO_SRC = '/seo/demo-motion.mp4';
