// @ts-ignore
// @ts-nocheck
/** @type {import('./$types').PageLoad} */

export const load = ({ params }) => {
    return {
        slug: params.slug,
    }
}