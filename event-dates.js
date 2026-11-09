const EVENT_MONTHS = [
    '', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

function eventDates(event) {
    if (event.dataInicio) return event;

    // Compatibilidade com registros publicados pelo painel anterior.
    const match = (event.data || '').match(/^(\d{1,2})(?:\s*[-–a]\s*(\d{1,2}))?\s+de\s+[^\s]+(?:\s*[-–—]\s*(.+))?$/i);
    if (!match || !EVENT_MONTHS[event.mes]) return {};
    const prefix = '2027-' + String(event.mes).padStart(2, '0') + '-';
    const [, start, end, note] = match;
    return {
        dataInicio: prefix + start.padStart(2, '0'),
        dataFim: end && prefix + end.padStart(2, '0'),
        observacaoData: note
    };
}

function compareEventDates(a, b) {
    return Number(a.mes) - Number(b.mes) ||
        (eventDates(a).dataInicio || '').localeCompare(eventDates(b).dataInicio || '');
}

function formatEventDate(start, end, note) {
    const formatDay = date => date.slice(8) + ' de ' + EVENT_MONTHS[Number(date.slice(5, 7))];
    const startDay = end && start.slice(0, 7) === end.slice(0, 7) ? start.slice(8) : formatDay(start);
    const date = end ? startDay + ' a ' + formatDay(end) : startDay;
    return note ? date + ' — ' + note : date;
}

function summaryEventDate(event) {
    const { dataInicio, dataFim } = eventDates(event);
    if (!dataInicio) return event.data || '';
    if (!dataFim) return dataInicio.slice(8);
    if (dataInicio.slice(0, 7) === dataFim.slice(0, 7)) {
        return dataInicio.slice(8) + '–' + dataFim.slice(8);
    }
    const shortDate = date => date.slice(8) + '/' + date.slice(5, 7);
    return shortDate(dataInicio) + ' a ' + shortDate(dataFim);
}
