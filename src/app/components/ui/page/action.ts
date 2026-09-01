export type PageAction = {
    label: string,
    primary?: boolean,
    to?: string,
    handler?: () => void
}