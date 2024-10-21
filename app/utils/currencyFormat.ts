export default function (value:number, locale:string = 'pt-BR', currency:string = 'BRL') {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(value);
  }