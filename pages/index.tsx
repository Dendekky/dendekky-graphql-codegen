
import { Button, Card, Col, Row, Form, Input, Space } from 'antd';
import axios from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';

import styles from '@/styles/Home.module.css';
import useApi from '@/hooks/useApi';

export default function GraphQLApiTypes() {
  const [form] = Form.useForm();
  const router = useRouter();
  const { graphqlApiEndpoint } = router.query;
  const {
    data: unAuthenticatedData,
    loading: unAuthenticatedLoading,
    error: unAuthenticatedError,
  } = useApi(
    `/api/codegen/?graphqlApiEndpoint=${graphqlApiEndpoint}`,
    !!graphqlApiEndpoint
  );
  const [authenticatedLoading, setAuthenticatedLoading] = useState(false)

  const [authenticatedData, setAuthenticatedData] = useState<any>();

  const handleSubmit = (e: React.MouseEvent<HTMLElement>) => {
    setAuthenticatedLoading(true)
    e.preventDefault();
    form
      .validateFields()
      .then(async (values) => {
        // form.resetFields();
        const resp = await axios.post(
          `/api/codegen`,
          { graphqlApiEndpoint: values.graphqlApiEndpoint },
          {
            headers: {
              authorization: values.authorization,
            },
          }
        );
        setAuthenticatedLoading(false)
        setAuthenticatedData(resp.data);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <>
      <Head>
        <title>Graphql Codegen Web Wrapper</title>
        <meta name='description' content='Graphql Codegen Web Wrapper' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className={styles.main}>
        {graphqlApiEndpoint ? (
          <Row gutter={12}>
            <Col sm={8}>
              <Button href='/'>Return Home</Button>
            </Col>
            <Col sm={16}>
              <Card className={styles.result} loading={unAuthenticatedLoading}>
                {unAuthenticatedData?.data}
              </Card>
            </Col>
          </Row>
        ) : (
          <Row gutter={12}>
            <Col sm={8}>
              <Form layout='vertical' form={form} name='graphql-codegen-form'>
                <Form.Item
                  label='GraphQL Endpoint'
                  name='graphqlApiEndpoint'
                  rules={[
                    {
                      required: true,
                      message: 'Please, enter a graphQL api link',
                    },
                  ]}
                  required={true}
                >
                  <Input
                    type='text'
                    placeholder='https://swapi-graphql.netlify.app/.netlify/functions/index'
                  />
                </Form.Item>
                <Form.Item label='Authorization' name='authorization'>
                  <Input type='text' placeholder='Auth Token' />
                </Form.Item>
                <Space size={16}>
                  <Button htmlType='submit' onClick={handleSubmit}>
                    Fetch Types
                  </Button>
                </Space>
              </Form>
            </Col>
            <Col sm={16}>
              <Card className={styles.result} loading={authenticatedLoading}>
                {authenticatedData?.data}
              </Card>
            </Col>
          </Row>
        )}
      </main>
    </>
  );
}
