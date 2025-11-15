import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { TransportItem } from '../../types';
import { useAppSelector } from '../../redux/hooks';

interface TransportCardProps {
  item: TransportItem;
  onPress: () => void;
  onFavouritePress?: () => void;
  isFavourite?: boolean;
}

const { width } = Dimensions.get('window');

const TransportCard: React.FC<TransportCardProps> = ({
  item,
  onPress,
  onFavouritePress,
  isFavourite = false,
}) => {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return '#34C759';
      case 'Upcoming':
        return '#007AFF';
      case 'Popular':
        return '#FF9500';
      case 'Delayed':
        return '#FF3B30';
      default:
        return '#666666';
    }
  };

  const getTypeIcon = (type: string): keyof typeof Feather.glyphMap => {
    switch (type) {
      case 'bus':
        return 'truck';
      case 'train':
        return 'navigation';
      case 'car':
        return 'navigation-2';
      case 'tuk_tuk':
        return 'zap';
      case 'destination':
        return 'map-pin';
      default:
        return 'map';
    }
  };

  return (
    <TouchableOpacity
      style={[styles.card, isDarkMode && styles.cardDark]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      
      {onFavouritePress && (
        <TouchableOpacity
          style={styles.favouriteButton}
          onPress={onFavouritePress}
        >
          <Feather
            name="heart"
            size={24}
            color={isFavourite ? '#FF3B30' : '#FFFFFF'}
          />
        </TouchableOpacity>
      )}

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.typeContainer}>
            <Feather
              name={getTypeIcon(item.type)}
              size={16}
              color="#007AFF"
              style={styles.typeIcon}
            />
            <Text style={[styles.type, isDarkMode && styles.typeDark]}>
              {item.type.toUpperCase()}
            </Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.status) + '20' },
            ]}
          >
            <Text
              style={[styles.status, { color: getStatusColor(item.status) }]}
            >
              {item.status}
            </Text>
          </View>
        </View>

        <Text
          style={[styles.title, isDarkMode && styles.titleDark]}
          numberOfLines={1}
        >
          {item.title}
        </Text>
        
        <Text
          style={[styles.description, isDarkMode && styles.descriptionDark]}
          numberOfLines={2}
        >
          {item.description}
        </Text>

        <View style={styles.footer}>
          {item.from && item.to && (
            <View style={styles.routeContainer}>
              <Feather name="map" size={14} color="#666666" />
              <Text style={[styles.route, isDarkMode && styles.routeDark]} numberOfLines={1}>
                {item.from} → {item.to}
              </Text>
            </View>
          )}
          {item.departureTime && !item.from && (
            <View style={styles.timeContainer}>
              <Feather name="clock" size={14} color="#666666" />
              <Text style={[styles.time, isDarkMode && styles.timeDark]}>
                {item.departureTime}
              </Text>
            </View>
          )}
          {item.price !== undefined && item.price > 0 && (
            <Text style={[styles.price, isDarkMode && styles.priceDark]}>
              Rs. {item.price}
            </Text>
          )}
          {item.duration && (
            <View style={styles.durationContainer}>
              <Feather name="clock" size={14} color="#666666" />
              <Text style={[styles.duration, isDarkMode && styles.durationDark]}>
                {item.duration}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardDark: {
    backgroundColor: '#1C1C1E',
  },
  image: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  favouriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeIcon: {
    marginRight: 6,
  },
  type: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007AFF',
  },
  typeDark: {
    color: '#0A84FF',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  status: {
    fontSize: 11,
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 6,
  },
  titleDark: {
    color: '#FFFFFF',
  },
  description: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 12,
  },
  descriptionDark: {
    color: '#ABABAB',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  route: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 6,
  },
  routeDark: {
    color: '#ABABAB',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 6,
  },
  timeDark: {
    color: '#ABABAB',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  duration: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 6,
  },
  durationDark: {
    color: '#ABABAB',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#007AFF',
  },
  priceDark: {
    color: '#0A84FF',
  },
});

export default TransportCard;
