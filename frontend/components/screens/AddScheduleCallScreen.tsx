import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    FlatList,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useColorScheme
} from 'react-native';
import { addScheduleItem } from './ScheduleCallsScreen';

interface Contact {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

const mockContacts: Contact[] = [
  { id: '1', name: 'Robert Smith', role: 'Board Member' },
  { id: '2', name: 'Maria Garcia', role: 'Investor' },
  { id: '3', name: 'John Wilson', role: 'Partner' },
  { id: '4', name: 'Sarah Chen', role: 'Team Lead' },
  { id: '5', name: 'David Kim', role: 'Client' },
  { id: '6', name: 'Lisa Johnson', role: 'Vendor' },
];

export default function AddScheduleCallScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [description, setDescription] = useState('');
  const [newContactName, setNewContactName] = useState('');
  const [newContactRole, setNewContactRole] = useState('');
  const [showNewContactForm, setShowNewContactForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const formatTime = (time: Date) => {
    return time.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const colors = {
    background: isDark ? '#000000' : '#FFFFFF',
    primaryText: isDark ? '#FFFFFF' : '#000000',
    secondaryText: isDark ? '#8E8E93' : '#666666',
    border: isDark ? '#2C2C2E' : '#E5E5E5',
    cardBackground: isDark ? '#1C1C1E' : '#F8F9FA',
    inputBackground: isDark ? '#2C2C2E' : '#F8F9FA',
    buttonPrimary: '#007AFF',
    buttonSecondary: isDark ? '#2C2C2E' : '#E5E5E5',
  };

  const handleSave = () => {
    if (!selectedContact && !newContactName) {
      Alert.alert('Error', 'Please select a contact or add a new one');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Error', 'Please add a description for the speaking context');
      return;
    }

    // Determine the contact name to use
    const contactName = selectedContact 
      ? `${selectedContact.role} - ${selectedContact.name}`
      : `${newContactRole} - ${newContactName}`;

    // Create the new schedule item
    const newScheduleItem = {
      personName: contactName,
      reason: description.trim(),
      time: formatTime(selectedTime),
      date: formatDate(selectedDate),
      status: 'upcoming' as const,
    };

    // Add to global data
    addScheduleItem(newScheduleItem);

    Alert.alert('Success', 'Call scheduled successfully!', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  const renderContactItem = ({ item }: { item: Contact }) => (
    <TouchableOpacity
      style={[styles.contactItem, { backgroundColor: colors.cardBackground }]}
      onPress={() => {
        setSelectedContact(item);
        setShowContactModal(false);
        setShowNewContactForm(false);
      }}
    >
      <View style={[styles.contactAvatar, { backgroundColor: colors.buttonPrimary }]}>
        <Text style={styles.contactAvatarText}>
          {item.name.split(' ').map(n => n[0]).join('')}
        </Text>
      </View>
      <View style={styles.contactInfo}>
        <Text style={[styles.contactName, { color: colors.primaryText }]}>
          {item.name}
        </Text>
        <Text style={[styles.contactRole, { color: colors.secondaryText }]}>
          {item.role}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, {
        backgroundColor: colors.background,
        borderBottomColor: colors.border
      }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.primaryText} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.primaryText }]}>
          Schedule Call
        </Text>
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.buttonPrimary }]}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Contact Selection */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>
            Contact
          </Text>
          
          <TouchableOpacity
            style={[styles.contactSelector, {
              backgroundColor: colors.inputBackground,
              borderColor: colors.border
            }]}
            onPress={() => setShowContactModal(true)}
          >
            {selectedContact ? (
              <View style={styles.selectedContactContainer}>
                <View style={[styles.selectedContactAvatar, { backgroundColor: colors.buttonPrimary }]}>
                  <Text style={styles.selectedContactAvatarText}>
                    {selectedContact.name.split(' ').map(n => n[0]).join('')}
                  </Text>
                </View>
                <View>
                  <Text style={[styles.selectedContactName, { color: colors.primaryText }]}>
                    {selectedContact.name}
                  </Text>
                  <Text style={[styles.selectedContactRole, { color: colors.secondaryText }]}>
                    {selectedContact.role}
                  </Text>
                </View>
              </View>
            ) : (
              <Text style={[styles.placeholderText, { color: colors.secondaryText }]}>
                Select contact or add new
              </Text>
            )}
            <Ionicons name="chevron-forward" size={20} color={colors.secondaryText} />
          </TouchableOpacity>
        </View>

        {/* Date & Time Selection */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>
            Date & Time
          </Text>
          
          <View style={styles.dateTimeContainer}>
            {/* Date Selector */}
            <TouchableOpacity
              style={[styles.dateTimeButton, {
                backgroundColor: colors.inputBackground,
                borderColor: colors.border,
                flex: 1,
                marginRight: 8,
              }]}
              onPress={() => {
                setShowTimePicker(false); // Close time picker if open
                setShowDatePicker(true);
              }}
            >
              <Ionicons name="calendar-outline" size={20} color={colors.secondaryText} />
              <Text style={[styles.dateTimeText, { color: colors.primaryText }]}>
                {formatDate(selectedDate)}
              </Text>
            </TouchableOpacity>

            {/* Time Selector */}
            <TouchableOpacity
              style={[styles.dateTimeButton, {
                backgroundColor: colors.inputBackground,
                borderColor: colors.border,
                flex: 1,
                marginLeft: 8,
              }]}
              onPress={() => {
                setShowDatePicker(false); // Close date picker if open
                setShowTimePicker(true);
              }}
            >
              <Ionicons name="time-outline" size={20} color={colors.secondaryText} />
              <Text style={[styles.dateTimeText, { color: colors.primaryText }]}>
                {formatTime(selectedTime)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Speaking Context */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>
            Speaking Context & Instructions
          </Text>
          <Text style={[styles.sectionSubtitle, { color: colors.secondaryText }]}>
            Describe how you want to approach this conversation
          </Text>
          
          <TextInput
            style={[styles.descriptionInput, {
              backgroundColor: colors.inputBackground,
              borderColor: colors.border,
              color: colors.primaryText
            }]}
            placeholder="e.g., Be formal, discuss Q4 financials, mention cost reduction initiatives..."
            placeholderTextColor={colors.secondaryText}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      </ScrollView>

      {/* Contact Selection Modal */}
      <Modal
        visible={showContactModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, {
            backgroundColor: colors.background,
            borderBottomColor: colors.border
          }]}>
            <TouchableOpacity onPress={() => setShowContactModal(false)}>
              <Text style={[styles.modalCancelText, { color: colors.buttonPrimary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.primaryText }]}>
              Select Contact
            </Text>
            <TouchableOpacity onPress={() => setShowNewContactForm(true)}>
              <Text style={[styles.modalAddText, { color: colors.buttonPrimary }]}>
                New
              </Text>
            </TouchableOpacity>
          </View>

          {showNewContactForm ? (
            <View style={styles.newContactForm}>
              <Text style={[styles.formTitle, { color: colors.primaryText }]}>
                Add New Contact
              </Text>
              
              <TextInput
                style={[styles.formInput, {
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.border,
                  color: colors.primaryText
                }]}
                placeholder="Contact Name"
                placeholderTextColor={colors.secondaryText}
                value={newContactName}
                onChangeText={setNewContactName}
              />
              
              <TextInput
                style={[styles.formInput, {
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.border,
                  color: colors.primaryText
                }]}
                placeholder="Role/Title"
                placeholderTextColor={colors.secondaryText}
                value={newContactRole}
                onChangeText={setNewContactRole}
              />
              
              <View style={styles.formButtons}>
                <TouchableOpacity
                  style={[styles.formButton, { backgroundColor: colors.buttonSecondary }]}
                  onPress={() => {
                    setShowNewContactForm(false);
                    setNewContactName('');
                    setNewContactRole('');
                  }}
                >
                  <Text style={[styles.formButtonText, { color: colors.primaryText }]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.formButton, { backgroundColor: colors.buttonPrimary }]}
                  onPress={() => {
                    if (newContactName.trim() && newContactRole.trim()) {
                      const newContact: Contact = {
                        id: Date.now().toString(),
                        name: newContactName.trim(),
                        role: newContactRole.trim(),
                      };
                      setSelectedContact(newContact);
                      setShowContactModal(false);
                      setShowNewContactForm(false);
                      setNewContactName('');
                      setNewContactRole('');
                    }
                  }}
                >
                  <Text style={styles.formButtonText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <FlatList
              data={mockContacts}
              renderItem={renderContactItem}
              keyExtractor={(item) => item.id}
              style={styles.contactList}
            />
          )}
        </View>
      </Modal>

      {/* Date Picker */}
      {showDatePicker && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={showDatePicker}
          onRequestClose={() => setShowDatePicker(false)}
        >
          <View style={styles.pickerModalContainer}>
            <View style={[styles.pickerContainer, { backgroundColor: colors.background }]}>
              <View style={[styles.pickerHeader, { borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <Text style={[styles.pickerCancelText, { color: colors.buttonPrimary }]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <Text style={[styles.pickerTitle, { color: colors.primaryText }]}>
                  Select Date
                </Text>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <Text style={[styles.pickerDoneText, { color: colors.buttonPrimary }]}>
                    Done
                  </Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="spinner"
                onChange={(event, date) => {
                  if (date) {
                    setSelectedDate(date);
                  }
                }}
                minimumDate={new Date()}
                style={styles.picker}
                textColor={colors.primaryText}
              />
            </View>
          </View>
        </Modal>
      )}

      {/* Time Picker */}
      {showTimePicker && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={showTimePicker}
          onRequestClose={() => setShowTimePicker(false)}
        >
          <View style={styles.pickerModalContainer}>
            <View style={[styles.pickerContainer, { backgroundColor: colors.background }]}>
              <View style={[styles.pickerHeader, { borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                  <Text style={[styles.pickerCancelText, { color: colors.buttonPrimary }]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <Text style={[styles.pickerTitle, { color: colors.primaryText }]}>
                  Select Time
                </Text>
                <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                  <Text style={[styles.pickerDoneText, { color: colors.buttonPrimary }]}>
                    Done
                  </Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={selectedTime}
                mode="time"
                display="spinner"
                onChange={(event, time) => {
                  if (time) {
                    setSelectedTime(time);
                  }
                }}
                style={styles.picker}
                textColor={colors.primaryText}
              />
            </View>
          </View>
        </Modal>
      )}

      <View style={styles.bottomPadding} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  contactSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  selectedContactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectedContactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  selectedContactAvatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  selectedContactName: {
    fontSize: 16,
    fontWeight: '600',
  },
  selectedContactRole: {
    fontSize: 14,
  },
  placeholderText: {
    flex: 1,
    fontSize: 16,
  },
  descriptionInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  modalCancelText: {
    fontSize: 16,
  },
  modalTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  modalAddText: {
    fontSize: 16,
    fontWeight: '600',
  },
  contactList: {
    flex: 1,
    padding: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  contactAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactAvatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  contactRole: {
    fontSize: 14,
  },
  newContactForm: {
    padding: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 24,
  },
  formInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  formButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  formButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  formButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  dateTimeText: {
    fontSize: 16,
    fontWeight: '500',
  },
  pickerModalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pickerContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34, // Safe area padding
  },
  pickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  pickerCancelText: {
    fontSize: 16,
  },
  pickerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  pickerDoneText: {
    fontSize: 16,
    fontWeight: '600',
  },
  picker: {
    height: 200,
  },
  bottomPadding: {
    height: 120,
  },
});