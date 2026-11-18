export type UserRole = 'user'|'doctor';
export type User = { id:string; name:string; phone:string; email?:string; role:UserRole; city?:string; avatar?:string };
