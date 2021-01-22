import React, { useContext, useEffect, useMemo, useState } from "react";
import { IProfile } from "../../app/models/profile";
import { ISelectOptions } from "../../app/models/reactSelectOptions";
import { RootStoreContext } from "../../app/stores/rootStore";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { AxiosResponse } from "axios";
import { Controller, useForm } from "react-hook-form";
import { IUserSiteFormValues } from "../../app/models/userSiteFormValues";
import { Button, Form, Header, Segment } from "semantic-ui-react";
import Select from "react-select";
import ErrorMessage from "../../app/common/form/ErrorMessage";
import { observer } from "mobx-react-lite";
import { toJS } from "mobx";

interface IProps {
  user: IProfile;
  companyId: number;
}

const AssignSiteToUserForm: React.FC<IProps> = ({ user, companyId }) => {
  const rootStore = useContext(RootStoreContext);
  const { getSiteOptionsByCompanyId } = rootStore.companyStore;
  const { closeModal } = rootStore.modalStore;
  const { assignSiteToUser, isSubmitting } = rootStore.userStore;

  const assignedSites = useMemo((): string[] => {
    let names: string[] = [];
    let sites = toJS(user.sites!);
    sites.forEach((site) => {
      names.push(site.name);
    });
    return names;
  }, [user.sites]);

  const [siteOptions, setSiteOptions] = useState<ISelectOptions[]>([]);
  const [siteIdValue, setSiteIdValue] = useState<number>();

  useEffect(() => {
    // filter out the select options for sites user is already assigned to
    setSiteOptions(
      getSiteOptionsByCompanyId(companyId).filter((option) => {
        return !assignedSites.includes(option.label);
      })
    );
  }, [assignedSites, getSiteOptionsByCompanyId, companyId]);

  const validationSchema = yup.object().shape({
    userId: yup.string().required("User Id is a required field"),
    siteId: yup.string().required("Site is a required field"),
  });

  const [submitErrors, setSubmitErrors] = useState<AxiosResponse>();

  const { handleSubmit, register, errors, formState, control, setValue } = useForm<IUserSiteFormValues>({
    defaultValues: {
      userId: user.id,
      siteId: undefined,
    },
    resolver: yupResolver(validationSchema),
  });

  const { isDirty } = formState;

  const onSubmit = (formValues: IUserSiteFormValues) => {
    formValues = {
      ...formValues,
      siteId: siteIdValue,
    };
    assignSiteToUser(formValues)
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

  const handleSiteChange = (value: ISelectOptions) => {
    if (value !== null) {
      setSiteIdValue(parseInt(value.value));
    } else {
      setValue("siteId", undefined);
    }
  };

  return (
    <Segment>
      <Header as="h3">Assign Site to {`${user.fullName}`}</Header>
      <Form onSubmit={handleSubmit(onSubmit)} error>
        <input type="hidden" name="userId" aria-invalid={errors.userId !== undefined} ref={register} />
        <Form.Field className={errors.siteId !== undefined ? "error field" : "field"}>
          <label>Site</label>
          <Controller
            name="siteId"
            defaultValue="undefined"
            control={control}
            render={({ onChange, value }) => (
              <Select
                options={siteOptions}
                onChange={(value) => {
                  onChange(value);
                  handleSiteChange(value);
                }}
                value={value}
                isClearable={true}
              />
            )}
          />
          {errors.siteId && (
            <div className="ui pointing above prompt label" id="form-select-site-error-message" role="alert" aria-atomic="true">
              {errors.siteId.message}
            </div>
          )}
        </Form.Field>

        <Button color="green" content="Assign" disabled={!isDirty} loading={isSubmitting} />
        {submitErrors && <ErrorMessage error={submitErrors!} />}
      </Form>
    </Segment>
  );
};

export default observer(AssignSiteToUserForm);
