import * as _ from "lodash";

export const toEqualInAnyOrderMatcher = {
    toEqualInAnyOrder<T>(actual: Array<T>, expected: Array<T>) {
        const pass = (actual.length === expected.length) &&
            _.every(actual, (actualItem) => {
                return _.some(expected, (expectedItem) => {
                    return _.isEqual(actualItem, expectedItem);
                });
            });
        if (pass) {
            return {
                message: () => (
                    `expected ${actual.toString()} not to be (in any order) ${expected.toString()}`
                ),
                pass: true,
            };
        } else {
            return {
                message: () => (`expected ${actual.toString()} to be (in any order) ${expected.toString()}`),
                pass: false,
            };
        }
    },
};