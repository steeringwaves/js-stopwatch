export const clearMocks: boolean;
export const collectCoverage: boolean;
export const coverageDirectory: string;
export const coveragePathIgnorePatterns: string[];
export const coverageProvider: string;
export namespace coverageThreshold {
    namespace global {
        const lines: number;
    }
}
export const preset: string;
export const reporters: (string | (string | {
    outputDirectory: string;
})[])[];
export const testMatch: string[];
