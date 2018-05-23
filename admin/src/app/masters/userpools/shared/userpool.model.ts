
export class UserPoolModel {
        UserPoolId: string;
        AdminCreateUserConfig: UserPoolAdminCreateUserConfig;
        AliasAttributes: string[];
        AutoVerifiedAttributes: AutoVerifiedAttributes[];
        CreationDate: number;
        DeviceConfiguration: UserPoolDeviceConfiguration;
        EmailConfiguration: UserPoolEmailConfiguration;
        EmailConfigurationFailure: string;
        EmailVerificationMessage: string;
        EmailVerificationSubject: string;
        EstimatedNumberOfUsers: number;
        Id: string;
        LambdaConfig: UserPoolLambdaConfig;
        LastModifiedDate: number;
        MfaConfiguration: MfaConfiguration;
        Name: string;
        Policies: UserPoolPolicies;
        SchemaAttributes: UserPoolSchemaAttributes[];
        SmsAuthenticationMessage: string;
        SmsConfiguration: UserPoolSmsConfiguration;
        SmsConfigurationFailure: string;
        SmsVerificationMessage: string;
        Status: string;
        UserPoolTags: Object;
}

export class UserPoolAdminCreateUserConfig {
        AllowAdminCreateUserOnly: boolean;
        UnusedAccountValidityDays: number;
        InviteMessageTemplate: UserPoolInviteMessageTemplate;
}

export class UserPoolInviteMessageTemplate {
        EmailMessage: string;
        EmailSubject: string;
        SMSMessage: string;
}

export class UserPoolDeviceConfiguration {
        ChallengeRequiredOnNewDevice: boolean;
        DeviceOnlyRememberedOnUserPrompt: boolean;
}

export class UserPoolEmailConfiguration {
        ReplyToEmailAddress: string;
        SourceArn: string;
}

export class UserPoolLambdaConfig {
        CreateAuthChallenge: string;
        CustomMessage: string;
        DefineAuthChallenge: string;
        PostAuthentication: string;
        PostConfirmation: string;
        PreAuthentication: string;
        PreSignUp: string;
        VerifyAuthChallengeResponse: string;
}

export class UserPoolPolicies {
        PasswordPolicy: UserPoolPasswordPolicy;
}


export class UserPoolPasswordPolicy {
        MinimumLength: number;
        RequireLowercase: boolean;
        RequireNumbers: boolean;
        RequireSymbols: boolean;
        RequireUppercase: boolean;
}

export class UserPoolSmsConfiguration {
        ExternalId: string;
        SnsCallerArn: string;
}

export class UserPoolSchemaAttributes {
        AttributeDataType: string;
        DeveloperOnlyAttribute: boolean;
        Mutable: boolean;
        Name: string;
        Required: boolean;
        NumberAttributeConstraints: UserPoolNumberAttributeConstraints;
        StringAttributeConstraints: UserPoolStringAttributeConstraints;
}

export class UserPoolNumberAttributeConstraints {
        MaxValue: string;
        MinValue: string;
}

export class UserPoolStringAttributeConstraints {
        MaxLength: string;
        MinLength: string;
}

export enum AttributeDataType {
        string = <any>'String',
        boolean = <any>'Boolean',
        datetime = <any>'DateTime',
        number = <any>'Number'
}

export enum MfaConfiguration {
        off = <any>'OFF',
        on = <any>'ON',
        optional = <any>'OPTIONAL'
}

export enum AutoVerifiedAttributes {
        email = <any>'email',
        phoneNumber = <any>'phone_number',
}

export class UserPoolClients {
        ClientName: string;
        ClientId: string;
        UserPoolId: string;
}

export class UserPoolDescribeClient {
        ClientName: string;
        ClientId: string;
        UserPoolId: string;
        ClientSecret: string;
        CreationDate: number;
        LastModifiedDate: number;
        RefreshTokenValidity: number;
        ReadAttributes: object;
        WriteAttributes: object;
}

