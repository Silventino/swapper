import { FindConditions, JoinOptions } from 'typeorm';

export interface FindOneOptions<Entity = any> {
  select?: (keyof Entity)[];
  where?: FindConditions<Entity> | FindConditions<Entity>[];
  relations?: string[];
  join?: JoinOptions;
  order?: {
    [P in keyof Entity]?: 'ASC' | 'DESC';
  };
}

export interface FindManyOptions<Entity = any> extends FindOneOptions<Entity> {
  skip?: number;
  take?: number;
}

export interface FindOneReq<Entity> {
  select?: (keyof Entity)[];
  where?: Where<Entity>;
  relations?: string[];
  order?: {
    [P in keyof Entity]?: 'ASC' | 'DESC';
  };
}

export interface FindManyReq<Entity> extends FindOneReq<Entity> {
  skip?: number;
  take?: number;
}

export type WhereObject<Entity> = Partial<{ [k in keyof Entity]: Entity[k] | QueryObjects | undefined }>;

export type Where<Entity> = WhereObject<Entity> | WhereObject<Entity>[] | undefined;

export type QueryObjects = SimpleQueryObject | BetweenQueryObject | InQueryObject;

type SimpleQueryObject = {
  type: 'LIKE' | 'GREATER' | 'LESS' | 'NOT' | 'GREATER_EQUAL' | 'LESS_EQUAL';
  value: string | number;
};

type InQueryObject = {
  type: 'IN';
  value: string[];
};

type BetweenQueryObject = {
  type: 'BETWEEN';
  firstValue: string | number;
  secondValue: string | number;
};

export const Like = (value: string) => {
  return {
    type: 'LIKE',
    value
  } as SimpleQueryObject;
};

export const GreaterThan = (value: string) => {
  return {
    type: 'GREATER',
    value
  } as SimpleQueryObject;
};

export const GreaterThanOrEqual = (value: string) => {
  return {
    type: 'GREATER_EQUAL',
    value
  } as SimpleQueryObject;
};

export const LessThan = (value: string) => {
  return {
    type: 'LESS',
    value
  } as SimpleQueryObject;
};

export const LessThanOrEqual = (value: string) => {
  return {
    type: 'LESS_EQUAL',
    value
  } as SimpleQueryObject;
};

export const Not = (value: string) => {
  return {
    type: 'NOT',
    value
  } as SimpleQueryObject;
};

export const In = (value: string[] | number[]) => {
  return {
    type: 'IN',
    value
  } as InQueryObject;
};

export const Between = (firstValue: string, secondValue: string) => {
  return {
    type: 'BETWEEN',
    firstValue,
    secondValue
  } as BetweenQueryObject;
};

export type QueryAdicional<T> = WhereObject<T> | undefined;
