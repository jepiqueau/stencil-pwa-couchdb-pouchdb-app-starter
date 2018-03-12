export function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function nFirstWords(str:string,n:number): string {
   return str.split(/\s+/).slice(0,n).join(" ") + ' ...';
}
export function getDateISOString(date:Date): string {
  return date.toISOString();
}
const months:Array<string> = [
  'January', 'February', 'March', 'April', 'May',
  'June', 'July', 'August', 'September',
  'October', 'November', 'December'
  ];

function monthNumToName(monthnum:number): string {
  return months[monthnum - 1] || '';
}
export function getFromDateISOStringToEnglish(iso:string): string {
  const d: Date = new Date(iso);
  return d.getDate().toString().replace(/^0+/, '') + ' ' + monthNumToName(d.getMonth()+1) +
         ' ' + d.getFullYear().toString();
}
