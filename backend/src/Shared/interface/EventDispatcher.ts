export interface IEventDispatcher {
    on(eventName: string, listener: (...args: any[]) => void): void
    emit(eventName: string, ...args: any[]): boolean;
}