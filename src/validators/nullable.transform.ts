import { Transform } from 'class-transformer';

export const Nullable = () =>
  Transform(({ value }) => {
    if (value === '' || value === 'null' || value === 'undefined') return null;
    return value;
  });
