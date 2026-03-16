import Map "mo:core/Map";
import Text "mo:core/Text";
import List "mo:core/List";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Include authorization logic from prefabricated Mixin
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type Gender = { #male; #female; #other };
  type WorkoutGoal = { #weightLoss; #muscleGain; #endurance; #generalHealth };

  public type UserProfile = {
    name : Text;
    age : Nat;
    weight : Float;
    gender : Gender;
    fitnessGoal : WorkoutGoal;
  };

  public type ExerciseLog = {
    name : Text;
    sets : Nat;
    reps : Nat;
    weight : Float;
    caloriesBurned : Float;
    metValue : Float;
  };

  public type WorkoutSession = {
    date : Text;
    exercises : [ExerciseLog];
    totalCalories : Float;
  };

  public type SessionStats = {
    totalWeightLifted : Float;
    totalCaloriesBurned : Float;
    totalSessions : Nat;
  };

  module SessionStats {
    public func compare(stats1 : SessionStats, stats2 : SessionStats) : Order.Order {
      Nat.compare(stats1.totalSessions, stats2.totalSessions);
    };

    public func compareByCalories(stats1 : SessionStats, stats2 : SessionStats) : Order.Order {
      Float.compare(stats1.totalCaloriesBurned, stats2.totalCaloriesBurned);
    };

    public func compareByTotalWeight(stats1 : SessionStats, stats2 : SessionStats) : Order.Order {
      Float.compare(stats1.totalWeightLifted, stats2.totalWeightLifted);
    };
  };

  // Persistent state
  let userProfiles = Map.empty<Principal, UserProfile>();
  let workoutSessions = Map.empty<Principal, List.List<WorkoutSession>>();
  let sessionStats = Map.empty<Principal, SessionStats>();

  // Lazy Met Value Initialization
  var metValuesCache : ?Map.Map<Text, Float> = null;
  func getMetValuesMap() : Map.Map<Text, Float> {
    switch (metValuesCache) {
      case (null) {
        let newMap : Map.Map<Text, Float> = Map.empty<Text, Float>();
        newMap.add("squat", 5.0);
        newMap.add("bench press", 5.0);
        newMap.add("deadlift", 6.0);
        newMap.add("pull-ups", 4.0);
        newMap.add("running", 8.0);
        metValuesCache := ?newMap;
        newMap;
      };
      case (?existing) { existing };
    };
  };

  // User profile functions
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  // Workout functions
  func computeCalories(exerciseName : Text, weight : Float, sets : Nat, reps : Nat) : Float {
    let metValue = switch (getMetValuesMap().get(exerciseName)) {
      case (null) { 3.5 }; // default MET value for unknown exercises
      case (?met) { met };
    };
    metValue * weight * sets.toFloat() * reps.toFloat() * 0.05;
  };

  public shared ({ caller }) func logWorkoutSession(date : Text, exercises : [ExerciseLog]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can log workouts");
    };

    let totalCalories = exercises.foldLeft(0.0, func(acc, ex) { acc + ex.caloriesBurned });
    let newSession = { date; exercises; totalCalories };

    switch (workoutSessions.get(caller)) {
      case (null) {
        let newSessionList = List.empty<WorkoutSession>();
        newSessionList.add(newSession);
        workoutSessions.add(caller, newSessionList);
      };
      case (?sessions) {
        sessions.add(newSession);
      };
    };

    updateStats(caller, exercises, totalCalories);
  };

  func updateStats(user : Principal, exercises : [ExerciseLog], sessionCalories : Float) {
    let sessionWeight = exercises.foldLeft(0.0, func(acc, ex) { acc + ex.weight * ex.sets.toFloat() });

    let newStats = switch (sessionStats.get(user)) {
      case (null) {
        {
          totalWeightLifted = sessionWeight;
          totalCaloriesBurned = sessionCalories;
          totalSessions = 1;
        };
      };
      case (?stats) {
        {
          totalWeightLifted = stats.totalWeightLifted + sessionWeight;
          totalCaloriesBurned = stats.totalCaloriesBurned + sessionCalories;
          totalSessions = stats.totalSessions + 1;
        };
      };
    };

    sessionStats.add(user, newStats);
  };

  public query ({ caller }) func getWorkoutSessions() : async [WorkoutSession] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view workout sessions");
    };
    switch (workoutSessions.get(caller)) {
      case (null) { [] };
      case (?sessions) { sessions.toArray() };
    };
  };

  public query ({ caller }) func getSessionStats() : async ?SessionStats {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view session stats");
    };
    sessionStats.get(caller);
  };

  public query ({ caller }) func getAllStatsSortedBySessionCount() : async [SessionStats] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all user statistics");
    };
    sessionStats.values().toArray().sort();
  };

  public query ({ caller }) func getAllStatsSortedByCalories() : async [SessionStats] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all user statistics");
    };
    sessionStats.values().toArray().sort(SessionStats.compareByCalories);
  };

  public query ({ caller }) func getAllStatsSortedByTotalWeight() : async [SessionStats] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all user statistics");
    };
    sessionStats.values().toArray().sort(SessionStats.compareByTotalWeight);
  };
};
