import { toJS } from "mobx";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { ISelectOptions } from "../../app/models/reactSelectOptions";
import { ISite } from "../../app/models/site";
import { RootStoreContext } from "../../app/stores/rootStore";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { AxiosResponse } from "axios";
import { Controller, useForm } from "react-hook-form";
import { IUserSiteFormValues } from "../../app/models/userSiteFormValues";
import { Button, Form, Header, Loader, Segment } from "semantic-ui-react";
import Select from "react-select";
import ErrorMessage from "../../app/common/form/ErrorMessage";
import { observer } from "mobx-react-lite";

interface IProps {
  site: ISite;
}

const AssignUserToSiteForm: React.FC<IProps> = ({ site }) => {
  const rootStore = useContext(RootStoreContext);
  const { closeModal } = rootStore.modalStore;
  const { assignUserToSite, isSubmitting } = rootStore.siteStore;
  const { getUsers, getUserOptionsByCompanyId, profileSelectOptions, loadingProfile } = rootStore.userStore;

  const assignedUsers = useMemo((): string[] => {
    let names: string[] = [];
    let users = toJS(site.users!);
    users.forEach((user) => {
      names.push(user.fullName);
    });
    return names;
  }, [site.users]);

  const [userOptions, setUserOptions] = useState<ISelectOptions[]>([]);
  const [userIdValue, setUserIdValue] = useState<string>();

  useEffect(() => {
    if (profileSelectOptions.length < 1) {
      getUsers();
    }
  }, [profileSelectOptions, getUsers]);

  useEffect(() => {
    // filter out the select options for users site is already assigned to
    setUserOptions(
      getUserOptionsByCompanyId(site.companyId).filter((option) => {
        return !assignedUsers.includes(option.label);
      })
    );
  }, [profileSelectOptions, assignedUsers]);

  const validationSchema = yup.object().shape({
    userId: yup.string().required("User Id is a required field"),
    siteId: yup.string().required("Site is a required field"),
  });

  const [submitErrors, setSubmitErrors] = useState<AxiosResponse>();

  const { handleSubmit, register, errors, formState, control, setValue } = useForm<IUserSiteFormValues>({
    defaultValues: {
      userId: "",
      siteId: site.id,
    },
    resolver: yupResolver(validationSchema),
  });

  const { isDirty } = formState;

  const onSubmit = (formValues: IUserSiteFormValues) => {
    formValues = {
      ...formValues,
      siteId: site.id,
      userId: userIdValue,
    };
    assignUserToSite(formValues)
      .then(() => {
        setSubmitErrors(undefined);
      })
      .catch((error) => {
        console.log("Sned Invite Error:", error.statusText); //remove
        setSubmitErrors(error);
      })
      .finally(() => {
        closeModal();
      });
  };

  const handleUserChange = (value: ISelectOptions) => {
    if (value !== undefined || value !== null) {
      setUserIdValue(value.value);
    } else {
      setValue("userId", undefined);
    }
  };

  return (
    <Segment>
      {loadingProfile && <Loader content="Loading options..." active />}
      <Header as="h3">Assign User to {`${site.name}`}</Header>
      <Form onSubmit={handleSubmit(onSubmit)} error>
        <input type="hidden" name="siteId" value={site.id} aria-invalid={errors.siteId !== undefined} ref={register} />
        <Form.Field className={errors.userId !== undefined ? "error field" : "field"}>
          <label>User</label>
          <Controller
            name="userId"
            defaultValue="undefined"
            control={control}
            render={({ onChange, value }) => (
              <Select
                options={userOptions}
                onChange={(value) => {
                  onChange(value);
                  handleUserChange(value);
                }}
                value={value}
                isClearable={true}
              />
            )}
          />
          {errors.userId && (
            <div className="ui pointing above prompt label" id="form-select-site-error-message" role="alert" aria-atomic="true">
              {errors.userId.message}
            </div>
          )}
        </Form.Field>

        <Button color="green" content="Assign" disabled={!isDirty} loading={isSubmitting} />
        {submitErrors && <ErrorMessage error={submitErrors!} />}
      </Form>
    </Segment>
  );
};

export default observer(AssignUserToSiteForm);
