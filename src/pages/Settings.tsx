import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Settings = () => {
  return (
    <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-semibold mb-8">Settings</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Manage your account details and preferences.
              </p>
              {/* Account settings content will go here */}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Customize how the application looks and feels.
              </p>
              {/* Appearance settings content will go here */}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Configure how and when you receive notifications.
              </p>
              {/* Notifications settings content will go here */}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Manage your security settings and password.
              </p>
              {/* Security settings content will go here */}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
