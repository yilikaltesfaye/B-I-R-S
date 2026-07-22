export const standardPhone = (input: string): string => {
  let standard = input.replace(/[^+\d]/g, "");

  if (standard.startsWith("09")) {
    return standard.replace(/^09/, "+2519");
  } else if (standard.startsWith("251")) {
    return "+" + standard;
  } else if (standard.startsWith("9")) {
    return "+251" + standard;
  } else if (standard.startsWith("+251")) {
    return standard;
  }
  return standard;
};
