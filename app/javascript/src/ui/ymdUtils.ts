import { addDays, format, parse, startOfWeek, subDays } from 'date-fns'

export const ymd = (date: Date): string => format(date, 'yyyy-MM-dd')
export const ymdToDate = (date: string): Date => parse(date, 'yyyy-MM-dd', new Date())
export const previousYmd = (date: string): string => ymd(subDays(ymdToDate(date), 1))
export const nextYmd = (date: string): string => ymd(addDays(ymdToDate(date), 1))
export const lastMonday = (date: string): string => ymd(startOfWeek(ymdToDate(date), { weekStartsOn: 1 }))
