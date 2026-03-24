export function generatePixPayload(key: string, name: string, city: string, amount: number, txid: string = '***'): string {
  const format = (id: string, value: string) => {
    const len = value.length.toString().padStart(2, '0');
    return `${id}${len}${value}`;
  };

  const cleanName = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9 ]/g, "").substring(0, 25);
  const cleanCity = city.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9 ]/g, "").substring(0, 15);

  const payloadFormat = format('00', '01');
  const merchantAccount = format('26', format('00', 'br.gov.bcb.pix') + format('01', key));
  const merchantCategory = format('52', '0000');
  const currency = format('53', '986');
  const amountStr = amount > 0 ? format('54', amount.toFixed(2)) : '';
  const country = format('58', 'BR');
  const merchantName = format('59', cleanName);
  const merchantCity = format('60', cleanCity);
  const additionalData = format('62', format('05', txid));

  const payload = `${payloadFormat}${merchantAccount}${merchantCategory}${currency}${amountStr}${country}${merchantName}${merchantCity}${additionalData}6304`;

  let crc = 0xFFFF;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc = crc << 1;
      }
    }
  }
  const crcHex = (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
  return `${payload}${crcHex}`;
}
