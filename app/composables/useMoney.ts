import { format, unformat } from 'v-money3';

const config = {
    debug: false,
    masked: false,
    prefix: '',
    suffix: '',
    thousands: '.',
    decimal: ',',
    precision: 2,
    allowBlank: false,
    minimumNumberOfCharacters: 0,
}

const formatMoney = (value: number) => format(value, config);
const unformatMoney = (value: string) => unformat(value, config);

export { formatMoney, unformatMoney }