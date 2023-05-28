export const rootRoute = 'org/default';
export const customRoute = (path: string) => `${rootRoute}/${path}/`;
export const changesRoute = customRoute('changes');
