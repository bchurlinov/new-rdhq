const getError = (errors: any, touched: any) => {
    if (!touched || !errors) return "";
    return errors.code || errors.name || errors;
};

// Examples of field.name >> 'region', 'events.0.name'
// while the errors are >> {region:'error'}, {name:'error', distance:'error'}
export const fieldError = (form: any, field: any) => {
    const keys = field.name.split(".");
    if (!form.errors[keys[0]] || !form.touched[keys[0]]) return "";
    if (keys.length < 3) return getError(form.errors[field.name], form.touched[field.name]);

    /* ---------------------------- EVENT INPUT CHECK --------------------------- */
    const touchedEvent = form.touched[keys[0]][keys[1]];
    // When submitCount > 0, then submit button has been clicked
    const touched = touchedEvent?.[keys[2]] || form.submitCount;
    const errors = form.errors[keys[0]][keys[1]]?.[keys[2]];

    return getError(errors, touched);
};
