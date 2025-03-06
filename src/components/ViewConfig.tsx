
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Settings, Save, RotateCcw } from 'lucide-react';

interface ViewConfigOption {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

interface ViewConfigProps {
  internalConfig: ViewConfigOption[];
  externalConfig: ViewConfigOption[];
  onSave: (internalConfig: ViewConfigOption[], externalConfig: ViewConfigOption[]) => void;
  className?: string;
}

const ViewConfig = ({ internalConfig, externalConfig, onSave, className }: ViewConfigProps) => {
  const [activeTab, setActiveTab] = useState<string>('internal');
  const [editedInternalConfig, setEditedInternalConfig] = useState<ViewConfigOption[]>(internalConfig);
  const [editedExternalConfig, setEditedExternalConfig] = useState<ViewConfigOption[]>(externalConfig);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const handleToggle = (id: string, isInternal: boolean) => {
    if (isInternal) {
      setEditedInternalConfig(prevConfig => 
        prevConfig.map(option => 
          option.id === id ? { ...option, enabled: !option.enabled } : option
        )
      );
    } else {
      setEditedExternalConfig(prevConfig => 
        prevConfig.map(option => 
          option.id === id ? { ...option, enabled: !option.enabled } : option
        )
      );
    }
  };
  
  const handleSave = async () => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSave(editedInternalConfig, editedExternalConfig);
      toast.success('View configurations saved successfully');
    } catch (error) {
      toast.error('Failed to save view configurations');
      console.error('Error saving view configurations:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    setEditedInternalConfig(internalConfig);
    setEditedExternalConfig(externalConfig);
    toast.info('View configurations reset to original state');
  };
  
  return (
    <div className={cn("bg-card rounded-lg border border-border shadow-sm", className)}>
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Settings size={18} className="text-muted-foreground" />
          <h3 className="font-medium">View Configuration</h3>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleReset}
            className="h-8"
          >
            <RotateCcw size={14} className="mr-1" />
            Reset
          </Button>
          <Button 
            size="sm" 
            onClick={handleSave}
            disabled={isLoading}
            className="h-8"
          >
            <Save size={14} className="mr-1" />
            Save Changes
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="internal" value={activeTab} onValueChange={setActiveTab}>
        <div className="px-4 pt-2">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="internal">Internal View</TabsTrigger>
            <TabsTrigger value="external">External View</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="internal" className="p-4 pt-6">
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-6">
              {editedInternalConfig.map((option) => (
                <div 
                  key={option.id} 
                  className="flex items-start justify-between space-x-4 pb-4 border-b border-border/50 last:border-0"
                >
                  <div>
                    <Label htmlFor={`internal-${option.id}`} className="text-base font-medium">
                      {option.label}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {option.description}
                    </p>
                  </div>
                  <Switch 
                    id={`internal-${option.id}`}
                    checked={option.enabled}
                    onCheckedChange={() => handleToggle(option.id, true)}
                  />
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="external" className="p-4 pt-6">
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-6">
              {editedExternalConfig.map((option) => (
                <div 
                  key={option.id} 
                  className="flex items-start justify-between space-x-4 pb-4 border-b border-border/50 last:border-0"
                >
                  <div>
                    <Label htmlFor={`external-${option.id}`} className="text-base font-medium">
                      {option.label}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {option.description}
                    </p>
                  </div>
                  <Switch 
                    id={`external-${option.id}`}
                    checked={option.enabled}
                    onCheckedChange={() => handleToggle(option.id, false)}
                  />
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ViewConfig;
