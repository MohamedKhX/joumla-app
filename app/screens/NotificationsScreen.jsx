const NotificationItem = ({ notification, onAction }) => {
    // Check if this is a shipment decision notification
    const isShipmentDecision = notification.data?.actions?.accept;

    if (isShipmentDecision) {
        return (
            <View style={styles.notificationItem}>
                <View style={styles.notificationHeader}>
                    <Ionicons 
                        name="warning" 
                        size={24} 
                        color="#F59E0B" 
                        style={styles.warningIcon} 
                    />
                    <Text style={styles.notificationTitle}>{notification.data.title}</Text>
                </View>
                <Text style={styles.notificationBody}>{notification.data.body}</Text>
                
                <View style={styles.actionButtons}>
                    <TouchableOpacity 
                        style={[styles.actionButton, styles.acceptButton]}
                        onPress={() => onAction(notification.data.actions.accept.url)}
                    >
                        <Text style={styles.buttonText}>متابعة مع الطلبات المقبولة</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={[styles.actionButton, styles.cancelButton]}
                        onPress={() => onAction(notification.data.actions.cancel.url)}
                    >
                        <Text style={styles.buttonText}>إلغاء جميع الطلبات</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    // Regular notification rendering
    return (
        <View style={styles.notificationItem}>
            <Text style={styles.notificationTitle}>{notification.title}</Text>
            <Text style={styles.notificationBody}>{notification.body}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    notificationItem: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    notificationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    warningIcon: {
        marginLeft: 8,
    },
    notificationTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 8,
    },
    notificationBody: {
        fontSize: 16,
        color: '#4B5563',
        marginBottom: 16,
        textAlign: 'right',
    },
    actionButtons: {
        flexDirection: 'column',
        gap: 8,
    },
    actionButton: {
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    acceptButton: {
        backgroundColor: '#10B981',
    },
    cancelButton: {
        backgroundColor: '#EF4444',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

// In your main component:
const handleNotificationAction = async (url) => {
    try {
        await axios.post(url);
        // Refresh notifications
        loadNotifications();
        Alert.alert('نجاح', 'تم تنفيذ الإجراء بنجاح');
    } catch (error) {
        console.error('Error handling notification action:', error);
        Alert.alert('خطأ', 'حدث خطأ أثناء تنفيذ الإجراء');
    }
}; 