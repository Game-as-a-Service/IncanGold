export interface IEventDispatcher{
    emit(eventName: string , ...args: any[]):boolean;
}