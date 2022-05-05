const STORAGE_CONSTANTS = {
    paymentSuccessMessage: "paymentSuccessMessage",
    loginSuccessMessage: "loginSuccessMessage",
    deleteRaceSuccess: "deleteRaceSuccess",
    currentRace: "currentRace",
    importRaceModalVisible: "importRaceModalVisible",
    importRaceErrorMessage: "importRaceErrorMessage",
    paymentRedirect: "paymentRedirect",
};

type StorageKeys = keyof typeof STORAGE_CONSTANTS;
export type StorageConstantsType = typeof STORAGE_CONSTANTS[StorageKeys];

export default STORAGE_CONSTANTS;
