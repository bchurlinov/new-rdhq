import React, { ChangeEvent, ReactElement, useState } from "react";
import { useAppDispatch, useAppSelector } from "app/store/hooks/use_store";
import { Button, Input, Text, useToast } from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import { updateAsyncUserProfile } from "app/store/user/user.actions";
import { IUserProfile } from "app/types";
import { IUserLocation } from "app/store/types/user.types";
import { AsyncDispatch } from "app/store/types/action.types";
import { _isEmpty } from "app/utils/helpers";
import Select from "app/components/elements/form/select";
import PageWithLoader from "app/hoc/page_with_loader";
import "./index.scss";

type SelectOptions = { value: string; name: string; icon: string };

// @TODO Add React i18next when the user changes country
function Profile(): ReactElement {
    const dispatch = useAppDispatch();
    const toast = useToast();

    const { user, userFetchLoading, userIsUpdating, user_locations } = useAppSelector(
        (state) => state.user
    );

    // Local state
    const [imageLoaded, setImageLoaded] = useState<boolean>(false);
    const [usernameError, setUsernameError] = useState<boolean>(false);
    const [profileImage, setProfileImage] = useState<string | ArrayBuffer | null>("");
    const [profile, setProfile] = useState<Partial<IUserProfile>>({
        username: user?.username || "",
        first_name: user?.first_name || "",
        last_name: user?.last_name || "",
        location: {
            name: user?.location?.name || "",
        },
    });

    const inputHandler = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setProfile({
            ...profile,
            [event.target.name]: event.target.value,
        });
    };

    const imageHandler = (event: ChangeEvent<HTMLInputElement>): void => {
        if (event.currentTarget.files) {
            const imageFile = event.currentTarget.files[0];
            const imageSize = imageFile.size / 1024 / 1024;
            const reader = new FileReader();

            if (imageSize >= 2) {
                toast({
                    description: "Image file size should not exceed 2MB",
                    status: "error",
                    duration: 3_500,
                    isClosable: true,
                    position: "top",
                });

                // event.currentTarget.value = null;
                return;
            }

            if (!imageFile) return;

            if (
                imageFile.type.includes("image/png") ||
                imageFile.type.includes("image/jpeg") ||
                imageFile.type.includes("image/jpg")
            ) {
                reader.readAsDataURL(imageFile);
                reader.onload = () => {
                    setProfile({ ...profile, image: { base64: reader.result as string } });
                    setProfileImage(reader.result);
                };
                reader.onerror = (err) => console.error(err);
            } else {
                toast({
                    description: "Only .jpg, .jpeg, .png file types are accepted",
                    status: "error",
                    duration: 3_500,
                    isClosable: true,
                    position: "top",
                });
            }
        }
    };

    const handleSelect = (value: string): void =>
        setProfile({ ...profile, location: { name: value } });

    const selectOptions = (): SelectOptions[] | boolean =>
        !_isEmpty(user_locations) &&
        user_locations.reduce((acc: SelectOptions[], item: IUserLocation | undefined) => {
            if (item) acc.push({ value: item?.name, name: item?.name, icon: item?.ccy });
            return acc;
        }, [] as SelectOptions[]);

    const handleSubmit = async (): Promise<void> => {
        setUsernameError(false);
        const response: AsyncDispatch<IUserProfile, { username: string[] }> = await dispatch(
            updateAsyncUserProfile(profile)
        );

        if (response && response.meta.requestStatus === "fulfilled") {
            toast({
                description: "Your profile has been successfully updated",
                status: "success",
                duration: 3_500,
                isClosable: true,
                position: "top",
            });
        }

        if (response?.meta.requestStatus === "rejected") {
            setUsernameError(true);
            toast({
                description: "Username field should not be blank",
                status: "error",
                duration: 3_500,
                isClosable: true,
                position: "top",
            });
        }
    };

    return (
        <PageWithLoader isLoading={userFetchLoading || _isEmpty(user)} rows={4}>
            <div className="user-profile">
                <div className="user-profile__top">
                    <div className="user-profile__top-item avatar-wrap">
                        <label htmlFor="avatar-upload" className="user-profile__avatar-label">
                            <img
                                src={(profileImage as string) || (user?.image as string)}
                                alt="rdhq_user_avatar"
                                className={`user-profile__avatar ${
                                    imageLoaded ? "image-loaded" : ""
                                }`}
                                onLoad={() => setImageLoaded(true)}
                            />
                            <EditIcon />
                            <input type="file" id="avatar-upload" onChange={imageHandler} />
                        </label>
                    </div>
                    <div className="user-profile__top-item user-wrap">
                        <div className="user-profile__form-group">
                            <Text variant="labelDefault">Email</Text>
                            <Input
                                type="email"
                                name="email"
                                value={user.email}
                                isDisabled
                                readOnly
                            />
                        </div>
                    </div>
                </div>
                <div className="user-profile__middle">
                    <div className="user-profile__middle-item">
                        <div className="user-profile__middle-item-label-wrap">
                            <Text variant="labelDefault">Username:</Text>
                        </div>

                        <div className="user-profile__middle-item-input-wrap">
                            <Input
                                type="text"
                                name="username"
                                value={profile.username}
                                onChange={(event) => inputHandler(event)}
                                isInvalid={usernameError}
                            />
                            <Text variant="labelSecondary">
                                Your race name or organization name
                            </Text>
                        </div>
                    </div>
                    <div className="user-profile__middle-item">
                        <div className="user-profile__middle-item-label-wrap">
                            <Text variant="labelDefault">First name:</Text>
                        </div>
                        <div className="user-profile__middle-item-input-wrap">
                            <Input
                                type="text"
                                name="first_name"
                                value={profile.first_name}
                                onChange={(event) => inputHandler(event)}
                            />
                        </div>
                    </div>
                    <div className="user-profile__middle-item">
                        <div className="user-profile__middle-item-label-wrap">
                            <Text variant="labelDefault">Last name: </Text>
                        </div>
                        <div className="user-profile__middle-item-input-wrap">
                            <Input
                                type="text"
                                name="last_name"
                                value={profile.last_name}
                                onChange={(event) => inputHandler(event)}
                            />
                        </div>
                    </div>
                    <div className="user-profile__middle-item">
                        <div className="user-profile__middle-item-label-wrap">
                            <Text variant="labelDefault">Region:</Text>
                        </div>
                        <div className="user-profile__middle-item-input-wrap">
                            <Select
                                placeholder={
                                    !_isEmpty(user) && user?.location?.name
                                        ? user.location.name
                                        : "Select option"
                                }
                                name="user_locations"
                                value={!_isEmpty(user) && user?.location?.name}
                                options={selectOptions()}
                                onChange={(value: string) => handleSelect(value)}
                            />
                        </div>
                    </div>
                </div>
                <div className="user-profile__bottom">
                    <Button
                        type="button"
                        variant="solid"
                        onClick={handleSubmit}
                        isLoading={userIsUpdating}
                    >
                        Save
                    </Button>
                </div>
            </div>
        </PageWithLoader>
    );
}

export default Profile;
