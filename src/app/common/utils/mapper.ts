import { Activity, ActivityFormValues } from "../../models/activity";
import { Profile } from "../../models/profile";
import { User } from "../../models/user";

export const mapActivityFormValueToActivity = (
  formValues: ActivityFormValues
) => Object.assign({}, formValues) as Activity;

export const mapUserToProfile = (user: User): Profile => ({
  username: user.username,
  displayName: user.displayName,
  followersCount: 0,
  followingCount: 0,
  isFollowing: false,
  image: user!.image,
});

export const mapActivityToActivityFormValues = (activity: Activity) =>
  ({
    id: activity.id,
    title: activity.title,
    category: activity.category,
    description: activity.description,
    date: activity.date,
    city: activity.city,
    venue: activity.venue,
  } as ActivityFormValues);
