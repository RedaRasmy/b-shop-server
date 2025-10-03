export const slugify = (name:string) =>
  name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
