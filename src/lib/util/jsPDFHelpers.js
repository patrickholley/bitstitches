/**
 * Sets center-aligned text
 * Ensure context is bound to the pdf object
 *
 * @param text: text to set
 * @param y: y-coordinate to set text
 */
export function centerText(y) {
  const internal = this.internal;
  const fontSize = internal.getFontSize();
  const pageWidth = internal.pageSize.width;
  const textWidth =
    (this.getStringUnitWidth(text) * fontSize) / internal.scaleFactor;
  const x = (pageWidth - textWidth) / 2;
  this.text(text, x, y);
  console.log(pageWidth);
}
