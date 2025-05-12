# Trial User Management Scripts

These scripts help you manage trial users in the RadOrderPad system by connecting to the EC2 instance and executing database queries.

## Prerequisites

1. SSH access to the EC2 instance
2. The private key file (`radorderpad-key-pair.pem`) in the `temp` directory
3. The EC2 instance must be running and accessible

## Available Scripts

### Check Trial User Validation Count

The `check-trial-user-ssh-updated.bat` script connects to the EC2 instance and checks the validation count and maximum validations for a trial user.

```
check-trial-user-ssh-updated.bat [userId]
```

- `userId`: (Optional) The ID of the trial user to check. Defaults to 31 if not provided.

Example:
```
check-trial-user-ssh-updated.bat 31
```

### Update Trial User Max Validations

The `update-trial-user-max-validations-updated.bat` script connects to the EC2 instance and updates the maximum validations for a trial user.

```
update-trial-user-max-validations-updated.bat [userId] [newMaxValidations]
```

- `userId`: (Optional) The ID of the trial user to update. Defaults to 31 if not provided.
- `newMaxValidations`: (Optional) The new maximum validations value. Defaults to 25 if not provided.

Example:
```
update-trial-user-max-validations-updated.bat 31 25
```

## Troubleshooting

If you encounter issues with the scripts:

1. Ensure the EC2 instance is running and accessible
2. Verify that the private key file is in the correct location and has the correct permissions
3. Check that the EC2 instance's security group allows SSH connections from your IP address
4. Verify that the EC2 instance's public IP address is correct in the scripts