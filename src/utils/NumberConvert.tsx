export function toNepaliNumber<T extends string | number>(input: T): string {
  const nepaliDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];

  return input
    .toString()
    .split("")
    .map((char) => (/\d/.test(char) ? nepaliDigits[parseInt(char)] : char))
    .join("");
}
