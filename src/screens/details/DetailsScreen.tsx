import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { toggleFavourite } from '../../redux/slices/favouritesSlice';
import { storageService } from '../../utils/storage';
import { showAlert } from '../../utils/alert';
import { HomeStackParamList } from '../../types';

type DetailsScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Details'>;
type DetailsScreenRouteProp = RouteProp<HomeStackParamList, 'Details'>;

interface DetailsScreenProps {
  navigation: DetailsScreenNavigationProp;
  route: DetailsScreenRouteProp;
}

const { width } = Dimensions.get('window');

const DetailsScreen: React.FC<DetailsScreenProps> = ({ navigation, route }) => {
  const { item } = route.params;
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const { favouriteIds } = useAppSelector((state) => state.favourites);
  const isFavourite = favouriteIds.includes(item.id);

  const handleFavouritePress = async () => {
    const wasAdded = !isFavourite;
    dispatch(toggleFavourite(item.id));
    
    // Update storage
    const currentFavourites = isFavourite
      ? favouriteIds.filter(id => id !== item.id)
      : [...favouriteIds, item.id];
    await storageService.saveFavourites(currentFavourites);
    
    // Show feedback
    const message = wasAdded 
      ? `${item.title} has been added to your favourites.`
      : `${item.title} has been removed from favourites.`;
    showAlert(wasAdded ? 'Added to Favourites' : 'Removed from Favourites', message);
  };

  const handleBooking = () => {
    const message = item.type === 'destination' 
      ? `Plan your visit to ${item.title}. This feature will connect to booking services in the full version.`
      : `Book ${item.title} for Rs. ${item.price}. This feature will connect to payment gateway in the full version.`;
    
    showAlert(
      item.type === 'destination' ? 'Plan Visit' : 'Book Transport',
      message,
      [{ text: 'OK' }]
    );
  };

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
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.image }} style={styles.image} />
          
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.favouriteButton}
            onPress={handleFavouritePress}
          >
            <Feather
              name="heart"
              size={24}
              color={isFavourite ? '#FF3B30' : '#FFFFFF'}
            />
          </TouchableOpacity>
        </View>

        <View style={[styles.content, isDarkMode && styles.contentDark]}>
          <View style={styles.headerRow}>
            <View style={styles.typeContainer}>
              <Feather
                name={getTypeIcon(item.type)}
                size={20}
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

          <Text style={[styles.title, isDarkMode && styles.titleDark]}>
            {item.title}
          </Text>

          <Text style={[styles.description, isDarkMode && styles.descriptionDark]}>
            {item.description}
          </Text>

          <View style={styles.infoSection}>
            <Text style={[styles.sectionTitle, isDarkMode && styles.sectionTitleDark]}>
              {item.type === 'destination' ? 'Visit Information' : 'Trip Information'}
            </Text>

            <View style={styles.infoGrid}>
              {item.from && (
                <View style={[styles.infoCard, isDarkMode && styles.infoCardDark]}>
                  <Feather name="map-pin" size={24} color="#34C759" />
                  <Text style={[styles.infoLabel, isDarkMode && styles.infoLabelDark]}>
                    From
                  </Text>
                  <Text style={[styles.infoValue, isDarkMode && styles.infoValueDark]}>
                    {item.from}
                  </Text>
                </View>
              )}

              {item.to && (
                <View style={[styles.infoCard, isDarkMode && styles.infoCardDark]}>
                  <Feather name="flag" size={24} color="#FF3B30" />
                  <Text style={[styles.infoLabel, isDarkMode && styles.infoLabelDark]}>
                    To
                  </Text>
                  <Text style={[styles.infoValue, isDarkMode && styles.infoValueDark]}>
                    {item.to}
                  </Text>
                </View>
              )}

              {item.departureTime && (
                <View style={[styles.infoCard, isDarkMode && styles.infoCardDark]}>
                  <Feather name="clock" size={24} color="#007AFF" />
                  <Text style={[styles.infoLabel, isDarkMode && styles.infoLabelDark]}>
                    Departure
                  </Text>
                  <Text style={[styles.infoValue, isDarkMode && styles.infoValueDark]}>
                    {item.departureTime}
                  </Text>
                </View>
              )}

              {item.arrivalTime && (
                <View style={[styles.infoCard, isDarkMode && styles.infoCardDark]}>
                  <Feather name="flag" size={24} color="#34C759" />
                  <Text style={[styles.infoLabel, isDarkMode && styles.infoLabelDark]}>
                    Arrival
                  </Text>
                  <Text style={[styles.infoValue, isDarkMode && styles.infoValueDark]}>
                    {item.arrivalTime}
                  </Text>
                </View>
              )}

              {item.duration && (
                <View style={[styles.infoCard, isDarkMode && styles.infoCardDark]}>
                  <Feather name="clock" size={24} color="#FF9500" />
                  <Text style={[styles.infoLabel, isDarkMode && styles.infoLabelDark]}>
                    Duration
                  </Text>
                  <Text style={[styles.infoValue, isDarkMode && styles.infoValueDark]}>
                    {item.duration}
                  </Text>
                </View>
              )}

              {item.distance && (
                <View style={[styles.infoCard, isDarkMode && styles.infoCardDark]}>
                  <Feather name="navigation" size={24} color="#007AFF" />
                  <Text style={[styles.infoLabel, isDarkMode && styles.infoLabelDark]}>
                    Distance
                  </Text>
                  <Text style={[styles.infoValue, isDarkMode && styles.infoValueDark]}>
                    {item.distance}
                  </Text>
                </View>
              )}

              {item.location && (
                <View style={[styles.infoCard, isDarkMode && styles.infoCardDark]}>
                  <Feather name="map-pin" size={24} color="#FF9500" />
                  <Text style={[styles.infoLabel, isDarkMode && styles.infoLabelDark]}>
                    Location
                  </Text>
                  <Text style={[styles.infoValue, isDarkMode && styles.infoValueDark]}>
                    {item.location}
                  </Text>
                </View>
              )}

              {item.rating && (
                <View style={[styles.infoCard, isDarkMode && styles.infoCardDark]}>
                  <Feather name="star" size={24} color="#FF9500" />
                  <Text style={[styles.infoLabel, isDarkMode && styles.infoLabelDark]}>
                    Rating
                  </Text>
                  <Text style={[styles.infoValue, isDarkMode && styles.infoValueDark]}>
                    {item.rating.toFixed(1)} ⭐
                  </Text>
                </View>
              )}
            </View>
          </View>

          {item.route && (
            <View style={styles.routeSection}>
              <Text style={[styles.sectionTitle, isDarkMode && styles.sectionTitleDark]}>
                Route Details
              </Text>
              <View style={[styles.routeCard, isDarkMode && styles.routeCardDark]}>
                <Feather name="map" size={20} color="#007AFF" style={styles.routeIcon} />
                <Text style={[styles.routeText, isDarkMode && styles.routeTextDark]}>
                  {item.route}
                </Text>
              </View>
            </View>
          )}

          {item.price !== undefined && (
            <View style={[styles.priceSection, isDarkMode && styles.priceSectionDark]}>
              <View>
                <Text style={[styles.priceLabel, isDarkMode && styles.priceLabelDark]}>
                  {item.price === 0 ? 'Entry' : 'Price'}
                </Text>
                <Text style={[styles.priceValue, isDarkMode && styles.priceValueDark]}>
                  {item.price === 0 ? 'Free' : `Rs. ${item.price}`}
                </Text>
              </View>
              <TouchableOpacity style={styles.bookButton} onPress={handleBooking}>
                <Text style={styles.bookButtonText}>
                  {item.type === 'destination' ? 'Plan Visit' : 'Book Now'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  containerDark: {
    backgroundColor: '#000000',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: width,
    height: 300,
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
  },
  favouriteButton: {
    position: 'absolute',
    top: 50,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    padding: 24,
  },
  contentDark: {
    backgroundColor: '#1C1C1E',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeIcon: {
    marginRight: 8,
  },
  type: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  typeDark: {
    color: '#0A84FF',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 12,
  },
  titleDark: {
    color: '#FFFFFF',
  },
  description: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 24,
    marginBottom: 24,
  },
  descriptionDark: {
    color: '#ABABAB',
  },
  infoSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 16,
  },
  sectionTitleDark: {
    color: '#FFFFFF',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoCard: {
    width: '48%',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  infoCardDark: {
    backgroundColor: '#2C2C2E',
  },
  infoLabel: {
    fontSize: 12,
    color: '#666666',
    marginTop: 8,
  },
  infoLabelDark: {
    color: '#ABABAB',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginTop: 4,
  },
  infoValueDark: {
    color: '#FFFFFF',
  },
  routeSection: {
    marginBottom: 24,
  },
  routeCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  routeCardDark: {
    backgroundColor: '#2C2C2E',
  },
  routeIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  routeText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: '#000000',
  },
  routeTextDark: {
    color: '#FFFFFF',
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 20,
  },
  priceSectionDark: {
    backgroundColor: '#2C2C2E',
  },
  priceLabel: {
    fontSize: 14,
    color: '#666666',
  },
  priceLabelDark: {
    color: '#ABABAB',
  },
  priceValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#007AFF',
    marginTop: 4,
  },
  priceValueDark: {
    color: '#0A84FF',
  },
  bookButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DetailsScreen;
