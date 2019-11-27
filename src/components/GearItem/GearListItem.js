import React from "react"
import _ from "lodash"
import { StyleSheet, View, Dimensions, Text, Image, Button, TouchableWithoutFeedback } from "react-native"
import { MaterialIcons, MaterialCommunityIcons, Feather } from "@expo/vector-icons"
import ProgressiveImage from "../shared/ProgressiveImage"
import StarRating from "../shared/StarRating"

const renderRatingStars = props => {
  return [...Array(props.rating)].map((e, i) => {
    return <MaterialIcons name="star" color="gold" size={props.size} key={i} />
  })
}

const GearListItem = props => {
  const { id, gearItemId, name, imageUrl, rating } = props.gearItem
  const width = Dimensions.get("window").width - 40
  const textWidth = width - 135

  return (
    <View
      key={id}
      shadowColor="gray"
      shadowOffset={{ width: 0, height: 0 }}
      shadowOpacity={0.5}
      shadowRadius={2}
      style={[styles.container, { width: width }]}>
      <TouchableWithoutFeedback style={styles.flex1} onPress={() => props.gearItemPress(id)}>
        <View style={styles.gearItemBox}>
          <View style={styles.imageContainer}>
            <ProgressiveImage style={styles.progressiveImageStyles} source={imageUrl} />
          </View>
          <View style={styles.nameContainer}>
            <Text style={[styles.textStyles, { width: textWidth }]} numberOfLines={2}>
              {name}
            </Text>
            <StarRating rating={rating} size={20} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 100,
    display: "flex",
    marginLeft: 20,
    marginTop: 15,
    backgroundColor: "white",
    borderRadius: 5
  },
  textStyles: {
    fontSize: 16,
    fontFamily: "open-sans-regular"
  },
  nameContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 10
  },
  gearItemBox: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "white",
    overflow: "hidden",
    borderRadius: 5
  },
  progressiveImageStyles: {
    width: 100,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    height: 100
  },
  flex1: {
    flex: 1
  },
  imageContainer: {
    width: 100,
    height: 100,
    backgroundColor: "lightgray"
  }
})

export default GearListItem
