export interface CurpResponse {
  curp: string;
  fatherName: string;
  motherName: string;
  name: string;
  gender: string; // https://en.wikipedia.org/wiki/ISO/IEC_5218
  birthday: string; // https://en.wikipedia.org/wiki/ISO_8601
  birthState: string; // https://www.iso.org/obp/ui/#iso:code:3166:MX
}
