/** Credits kept in the live element, copied snippet, and minified bundle. */
export const CREDIT_COMMENTS = [
  ' Design: Alex Krivov – alexkrivov.com ',
] as const;

export function creditMarkup(): string {
  return CREDIT_COMMENTS.map((text) => `<!--${text}-->`).join('\n');
}

export function appendCreditComments(root: ParentNode): void {
  for (const text of CREDIT_COMMENTS) {
    root.appendChild(document.createComment(text));
  }
}
