import { Formik, Form, Field, FieldProps } from "formik";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Segment, Header, Comment, Loader } from "semantic-ui-react";

import * as Yup from "yup";
import {
  addCommentAsync,
  appendComment,
  clearComments,
  setComments,
} from "./commentSlice";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../app/store/configureStore";
import { Activity } from "../../../../app/models/activity";
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { ChatComment } from "../../../../app/models/comment";
import {
  convertDateISOString,
  getDistanceToNow,
} from "../../../../app/common/utils/date";
import { useLoggedInUser } from "../../../users/userSlice";

interface Props {
  activity: Activity;
}

const ActivityDetailedChat = ({ activity }: Props) => {
  const dispatch = useAppDispatch();
  const comments = useAppSelector((state) => state.comment.comments);
  const [hubConnection, setHubConnection] = useState<HubConnection>();
  const currentUser = useLoggedInUser();
  const { selectedActivity } = useAppSelector((state) => state.activities);

  useEffect(() => {
    if (!activity) return;

    if (!hubConnection) {
      setHubConnection(
        new HubConnectionBuilder()
          .withUrl(
            process.env.REACT_APP_CHAT_URL + "?activityId=" + activity.id,
            {
              accessTokenFactory: () => currentUser.token!,
            }
          )
          .withAutomaticReconnect()
          .configureLogging(LogLevel.Information)
          .build()
      );
    }

    if (!hubConnection) return;

    hubConnection
      .start()
      .catch((error) =>
        console.log("Error establishing the connection: ", error)
      );

    hubConnection.on("LoadComments", (chatComments: ChatComment[]) => {
      chatComments.forEach((chatComment) => {
        chatComment.createdAt = convertDateISOString(chatComment.createdAt);
      });
      dispatch(setComments(chatComments));
    });

    hubConnection.on("ReceiveComment", (chatComment: ChatComment) => {
      chatComment.createdAt = convertDateISOString(chatComment.createdAt);
      dispatch(appendComment(chatComment));
    });

    return () => {
      dispatch(clearComments());
    };
  }, [activity, currentUser, dispatch, hubConnection]);

  return (
    <>
      <Segment
        textAlign="center"
        attached="top"
        inverted
        color="teal"
        style={{ border: "none" }}
      >
        <Header>Chat about this event</Header>
      </Segment>
      <Segment attached clearing>
        <Formik
          onSubmit={(values, { resetForm }) => {
            if (selectedActivity && hubConnection) {
              dispatch(
                addCommentAsync({
                  connection: hubConnection,
                  values,
                  selectedActivity,
                })
              ).then(() => resetForm());
            }
          }}
          initialValues={{ body: "" }}
          validationSchema={Yup.object({
            body: Yup.string().required(),
          })}
        >
          {({ isSubmitting, isValid, handleSubmit }) => (
            <Form className="ui form">
              <Field name="body">
                {(props: FieldProps) => (
                  <div style={{ position: "relative" }}>
                    <Loader active={isSubmitting} />
                    <textarea
                      placeholder="Enter your comment (Enter to submit, SHIFT + enter for new line)"
                      rows={2}
                      {...props.field}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && e.shiftKey) {
                          return;
                        }
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          isValid && handleSubmit();
                        }
                      }}
                    />
                  </div>
                )}
              </Field>
            </Form>
          )}
        </Formik>
        <Comment.Group>
          {comments.map((comment) => (
            <Comment key={comment.id}>
              <Comment.Avatar src={comment.image || "/assets/user.png"} />
              <Comment.Content>
                <Comment.Author as={Link} to={`/profiles/${comment.username}`}>
                  {comment.displayName}
                </Comment.Author>
                <Comment.Metadata>
                  <div>{getDistanceToNow(comment.createdAt)} ago</div>
                </Comment.Metadata>
                <Comment.Text style={{ whiteSpace: "pre-wrap" }}>
                  {comment.body}
                </Comment.Text>
              </Comment.Content>
            </Comment>
          ))}
        </Comment.Group>
      </Segment>
    </>
  );
};
export default ActivityDetailedChat;
