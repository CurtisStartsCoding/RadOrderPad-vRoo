import * as React from "react";
import { X, AlertCircle, Pill, Activity, FileText, Beaker } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { ClinicalContextItem } from "../types";

/**
 * ClinicalContextPanel Component
 * 
 * A slide-out panel that displays clinical context information for the patient.
 * Shows allergies, medications, conditions, labs, and notes.
 */
interface ClinicalContextPanelProps {
  /** Whether the panel is open */
  isOpen: boolean;
  
  /** Function to close the panel */
  onClose: () => void;
  
  /** Clinical context items to display */
  items: ClinicalContextItem[];
}

// Define the structure for grouped items
interface GroupedItems {
  allergy: ClinicalContextItem[];
  medication: ClinicalContextItem[];
  condition: ClinicalContextItem[];
  lab: ClinicalContextItem[];
  note: ClinicalContextItem[];
}

export const ClinicalContextPanel: React.FC<ClinicalContextPanelProps> = ({
  isOpen,
  onClose,
  items
}) => {
  // Get the icon for a context item based on its type
  const getItemIcon = (type: string) => {
    switch (type) {
      case 'allergy':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'medication':
        return <Pill className="h-5 w-5 text-blue-500" />;
      case 'condition':
        return <Activity className="h-5 w-5 text-amber-500" />;
      case 'lab':
        return <Beaker className="h-5 w-5 text-purple-500" />;
      case 'note':
        return <FileText className="h-5 w-5 text-gray-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // Get the severity badge color
  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'low':
        return 'bg-blue-100 text-blue-800';
      case 'medium':
        return 'bg-amber-100 text-amber-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Group items by type
  const groupedItems = React.useMemo(() => {
    const grouped: GroupedItems = {
      allergy: [],
      medication: [],
      condition: [],
      lab: [],
      note: []
    };
    
    items.forEach(item => {
      switch (item.type) {
        case 'allergy':
          grouped.allergy.push(item);
          break;
        case 'medication':
          grouped.medication.push(item);
          break;
        case 'condition':
          grouped.condition.push(item);
          break;
        case 'lab':
          grouped.lab.push(item);
          break;
        default:
          grouped.note.push(item);
          break;
      }
    });
    
    return grouped;
  }, [items]);
  
  return (
    <div
      className={`fixed inset-y-0 right-0 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Panel Header */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Clinical Context</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Panel Content */}
      <div className="p-4 overflow-y-auto h-[calc(100vh-64px)]">
        {items.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No clinical context available.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Allergies */}
            {groupedItems.allergy.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Allergies
                </h3>
                <ul className="space-y-2">
                  {groupedItems.allergy.map((item, index) => (
                    <li key={index} className="bg-gray-50 p-3 rounded-md">
                      <div className="flex">
                        <div className="flex-shrink-0 mt-0.5">
                          {getItemIcon(item.type)}
                        </div>
                        <div className="ml-3">
                          <div className="flex items-center">
                            <h4 className="text-sm font-medium text-gray-900">{item.title}</h4>
                            {item.severity && (
                              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(item.severity)}`}>
                                {item.severity}
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-gray-600">{item.description}</p>
                          {item.date && (
                            <p className="mt-1 text-xs text-gray-500">Recorded: {item.date}</p>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Conditions */}
            {groupedItems.condition.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Conditions
                </h3>
                <ul className="space-y-2">
                  {groupedItems.condition.map((item, index) => (
                    <li key={index} className="bg-gray-50 p-3 rounded-md">
                      <div className="flex">
                        <div className="flex-shrink-0 mt-0.5">
                          {getItemIcon(item.type)}
                        </div>
                        <div className="ml-3">
                          <div className="flex items-center">
                            <h4 className="text-sm font-medium text-gray-900">{item.title}</h4>
                            {item.severity && (
                              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(item.severity)}`}>
                                {item.severity}
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-gray-600">{item.description}</p>
                          {item.date && (
                            <p className="mt-1 text-xs text-gray-500">Recorded: {item.date}</p>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Medications */}
            {groupedItems.medication.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Medications
                </h3>
                <ul className="space-y-2">
                  {groupedItems.medication.map((item, index) => (
                    <li key={index} className="bg-gray-50 p-3 rounded-md">
                      <div className="flex">
                        <div className="flex-shrink-0 mt-0.5">
                          {getItemIcon(item.type)}
                        </div>
                        <div className="ml-3">
                          <h4 className="text-sm font-medium text-gray-900">{item.title}</h4>
                          <p className="mt-1 text-sm text-gray-600">{item.description}</p>
                          {item.date && (
                            <p className="mt-1 text-xs text-gray-500">Prescribed: {item.date}</p>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Labs */}
            {groupedItems.lab.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Lab Results
                </h3>
                <ul className="space-y-2">
                  {groupedItems.lab.map((item, index) => (
                    <li key={index} className="bg-gray-50 p-3 rounded-md">
                      <div className="flex">
                        <div className="flex-shrink-0 mt-0.5">
                          {getItemIcon(item.type)}
                        </div>
                        <div className="ml-3">
                          <h4 className="text-sm font-medium text-gray-900">{item.title}</h4>
                          <p className="mt-1 text-sm text-gray-600">{item.description}</p>
                          {item.date && (
                            <p className="mt-1 text-xs text-gray-500">Date: {item.date}</p>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Notes */}
            {groupedItems.note.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Notes
                </h3>
                <ul className="space-y-2">
                  {groupedItems.note.map((item, index) => (
                    <li key={index} className="bg-gray-50 p-3 rounded-md">
                      <div className="flex">
                        <div className="flex-shrink-0 mt-0.5">
                          {getItemIcon(item.type)}
                        </div>
                        <div className="ml-3">
                          <h4 className="text-sm font-medium text-gray-900">{item.title}</h4>
                          <p className="mt-1 text-sm text-gray-600">{item.description}</p>
                          {item.date && (
                            <p className="mt-1 text-xs text-gray-500">Date: {item.date}</p>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};