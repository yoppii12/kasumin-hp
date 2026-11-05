export type Slide = { title: string; points: string[]; summary: string };
export function parseSlide(src: string): Slide;
export function renderSlide(slide: Slide, label: string): string;
export function replaceSlides(markdown: string, label: string): string;
