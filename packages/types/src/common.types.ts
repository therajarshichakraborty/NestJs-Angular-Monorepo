export type Nullable<TValue> = TValue | null;

export type Maybe<TValue> = TValue | null | undefined;

export type Uuid = string;

export type IsoDateString = string;

export type Environment = "development" | "test" | "production";

export type DeepReadonly<TValue> = {
  readonly [TKey in keyof TValue]: TValue[TKey] extends object
    ? DeepReadonly<TValue[TKey]>
    : TValue[TKey];
};
