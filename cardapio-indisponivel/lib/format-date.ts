function toDate(value: Date | string | number): Date {
  return value instanceof Date ? value : new Date(value)
}

export function formatLongDate(date: Date | string | number) {
  const parsed = toDate(date)
  // #region agent log
  fetch('http://127.0.0.1:7538/ingest/105d5053-89a1-4ec7-974e-a3ff2c5d12a4',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'ef1545'},body:JSON.stringify({sessionId:'ef1545',location:'lib/format-date.ts:formatLongDate',message:'format date input',data:{inputType:typeof date,isDateInstance:date instanceof Date,parsedValid:!Number.isNaN(parsed.getTime())},timestamp:Date.now(),hypothesisId:'C'})}).catch(()=>{});
  // #endregion
  return parsed.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export function formatShortDate(date: Date | string | number) {
  const parsed = toDate(date)
  // #region agent log
  fetch('http://127.0.0.1:7538/ingest/105d5053-89a1-4ec7-974e-a3ff2c5d12a4',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'ef1545'},body:JSON.stringify({sessionId:'ef1545',location:'lib/format-date.ts:formatShortDate',message:'format date input',data:{inputType:typeof date,isDateInstance:date instanceof Date,parsedValid:!Number.isNaN(parsed.getTime())},timestamp:Date.now(),hypothesisId:'C'})}).catch(()=>{});
  // #endregion
  return parsed.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}
