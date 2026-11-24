export interface PetType {
  id: number;
  name: string;
}

export interface Visit {
  id: number;
  date: string;
  description: string;
}

export interface Pet {
  id: number;
  ownerId: number;
  name: string;
  birthDate: string;
  type: PetType;
  visits: Visit[];
}

export interface Owner {
  id: number;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  telephone: string;
  pets: Pet[];
}

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'warning' | 'info';
}

export type OwnerFields = Omit<Owner, 'id' | 'pets'>;
export type PetDetails = Pick<Pet, 'name' | 'birthDate' | 'type'>;
export type PetFields = Pick<Pet, 'name' | 'birthDate'> & { typeId: number };
export type VisitFields = Omit<Visit, 'id'>;
